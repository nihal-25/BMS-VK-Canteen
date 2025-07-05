import React, { useState, createContext, useEffect } from "react";
import {
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
} from "firebase/auth";
import { loginRequest } from './authentication.service';
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { Alert } from "react-native";
//import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Import shared Firebase instances
import { auth, firestore } from '../config/firebaseConfig';

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "55551343994-hbk48s7qv45ujdm0q6fpdt120cct560t.apps.googleusercontent.com",
  //   iosClientId: "55551343994-ip0t6m4ri4af85ktoetpg565pjp5e7m9.apps.googleusercontent.com",
  //   redirectUri: "vk:/oauthredirect",
  // });

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (usr) => {
    if (usr) {
      setUser(usr);
    } else {
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);


  const onLogin = (email, password) => {
  setIsLoading(true);
  loginRequest(email, password)
    .then((userCredential) => {
      const u = userCredential.user; // ✅ Extract user
      setUser(u);

      const userDocRef = doc(firestore, "users", u.uid);
      return setDoc(userDocRef, {
        email: u.email,
        lastLogin: new Date(),
      }, { merge: true });
    })
    .then(() => {
      setIsLoading(false);
    })
    .catch((e) => {
      setIsLoading(false);
      setError(e.message);
    });
};
  const onRegister = (email, password) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => { // This is important to get the user object
        const user = userCredential.user;
        setUser(user);
        const userDocRef = doc(firestore, "users", user.uid);
        return setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
        });
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };
  

  const onLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setUser(null);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };

  const onResetPassword = (email) => {
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsLoading(false);
        Alert.alert("Success", "Password reset email sent!");
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
        Alert.alert("Error", e.message);
      });
  };

  const sendOtpToPhone = async (phoneNumber, recaptchaVerifier) => {
    setIsLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setIsLoading(false);
      return confirmationResult;
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
      Alert.alert("Error", e.message);
      return null;
    }
  };

  const verifyOtp = async (confirmationResult, otp) => {
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      setIsLoading(false);
      Alert.alert("Success", "OTP verified!");
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // ✅ Add this line
        isLoading,
        error,
        onLogin,
        onRegister,
        onLogout,
        onResetPassword,
        sendOtpToPhone,
        verifyOtp,
        setUser,
        
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
  
  
};
