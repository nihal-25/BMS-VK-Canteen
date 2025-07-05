import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, Alert } from 'react-native';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/button'; 
import { colors } from '../utils/colors';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


const SignUpScreen = ({ navigation, route }) => {
  const { email: emailParam } = route.params || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSignUpPress = async () => {
    if (!email || !password || !name || !rePassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (password !== rePassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    try {
      const auth = getAuth();
      const firestore = getFirestore();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user details in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
  
      // ✅ Navigate to location selector after signup
      navigation.replace('LocationSelect');
  
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.subHeader}>Please sign up to get started</Text>
      
      <Text style={styles.intext}>Name</Text>
      <TextInput
        placeholder=""
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.gray2,
            underlineColor: 'transparent',
          },
        }}
      />

      <Text style={styles.intext}>Email</Text>
      <TextInput
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        theme={{
          colors: {
            primary: colors.gray2,
            underlineColor: 'transparent',
          },
        }}
      />

      <Text style={styles.intext}>Password</Text>
      <TextInput
        placeholder=""
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{
          colors: {
            primary: colors.gray2,
            underlineColor: 'transparent',
          },
        }}
      />

      <Text style={styles.intext}>Re-enter Password</Text>
      <TextInput
        placeholder=""
        value={rePassword}
        onChangeText={setRePassword}
        secureTextEntry
        style={styles.input}
        theme={{
          colors: {
            primary: colors.gray2,
            underlineColor: 'transparent',
          },
        }}
      />

      <Button
        title="SIGN UP"
        onPress={handleSignUpPress}
        style={styles.button}
        labelStyle={{ color: colors.white }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.pure,
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  intext: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    marginBottom: 20,
    height: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.pure,
    height: 50,
  },
});

export default SignUpScreen;
