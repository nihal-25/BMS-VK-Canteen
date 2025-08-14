import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/button';
import GoogleButton from '../components/GoogleButton';
import { Alert } from 'react-native';
import { colors } from '../utils/colors';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const SignInScreen = ({ navigation, route }) => {
  const { email: emailParam } = route.params || {};
  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

const handleSignInPress = async () => {
  setEmailError('');
  setPasswordError('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setEmailError('Email is required');
    return;
  }

  if (!emailRegex.test(email)) {
    setEmailError('Invalid email format');
    return;
  }

  if (!password) {
    setPasswordError('Password is required');
    return;
  }

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // ✅ Extract the user

    if (!user.emailVerified) { // ✅ Correct property name
      Alert.alert(
        'Email not verified',
        'Please verify your email before signing in.'
      );
      await auth.signOut();
      return;
    }

    // Redirect to location selector screen
    navigation.replace('LocationSelect');
    
  } catch (error) {
    console.log(error);
    setPasswordError('Incorrect email or password');
  }
};


  const handleGoogleSignIn = () => {
    console.log('Google Sign-In pressed');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  const onChangeEmail = (text) => {
    setEmail(text.toLowerCase());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: -500 })}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Sign In</Text>
            <Text style={styles.subHeader}>Please sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.intext}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email@bmsce.ac.in"
              value={email}
              onChangeText={onChangeEmail}
              mode="outlined"
              theme={{
                colors: {
                  primary: colors.gray2,
                  underlineColor: 'transparent',
                },
              }}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.intext}>Enter Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              theme={{
                colors: {
                  primary: colors.gray2,
                  underlineColor: 'transparent',
                },
              }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity onPress={handleForgotPasswordPress}>
              <Text style={styles.forgotPassword}>Forgot Password</Text>
            </TouchableOpacity>

            <Button
              title="SIGN IN"
              onPress={handleSignInPress}
              style={styles.button}
              labelStyle={{ color: colors.white }}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.googleButtonContainer}>
            <GoogleButton onPress={handleGoogleSignIn} />
          </View>

          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>
              By clicking continue, you agree to our{' '}
              <Text
                style={styles.link}
                onPress={() => console.log('Terms of Service Pressed')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.link}
                onPress={() => console.log('Privacy Policy Pressed')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 90,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.pure,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  formContainer: {
    marginVertical: 20,
  },
  intext: {
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
  forgotPassword: {
    color: colors.gray,
    textAlign: 'right',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.pure,
    height: 50,
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    bottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6E6E6',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#828282',
  },
  googleButtonContainer: {
    marginTop: -10,
    marginBottom: 30,
    alignItems: 'center',
  },
  bottomTextContainer: {
    padding: 20,
    alignItems: 'center',
  },
  bottomText: {
    color: '#828282',
    textAlign: 'center',
  },
  link: {
    color: colors.black,
  },
});

export default SignInScreen;
