import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { AuthenticationContext } from '../service/authentication.context';
import Button from '../components/button';
import Divider from '../components/Divider';
import { colors } from '../utils/colors';
import GoogleButton from '../components/GoogleButton';

WebBrowser.maybeCompleteAuthSession();

const Focus = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { onLogin, error } = useContext(AuthenticationContext);

  const handleSignUpPress = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!subject) {
      setErrorMessage('Please enter an email address');
      return;
    }

    if (!emailRegex.test(subject)) {
      setErrorMessage('Invalid email format');
      return;
    }

    setErrorMessage('');
    navigation.navigate('SignUp', { email: subject });
    setSubject('');
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
    setSubject('');
  };

  const onChangeSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    setSubject(lowerCaseQuery);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '55551343994-7t0rheie1nc8g0835k9rr80r1dev5fl8.apps.googleusercontent.com',
    webClientId: '55551343994-7t0rheie1nc8g0835k9rr80r1dev5fl8.apps.googleusercontent.com',
    androidClientId:'55551343994-b4s4smd06036oos2p190i0rtaq8km000.apps.googleusercontent.com',
    iosClientId:'55551343994-01oit49cep3s863rb18plt5bfn83kost.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@nihal2/VK',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          // Navigate to home or dashboard
          navigation.navigate('Home');
        })
        .catch((err) => {
          Alert.alert('Google Sign-In Error', err.message);
        });
    }
  }, [response]);

  const handleGoogleSignUp = () => {
    promptAsync();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.textContainer}>
            <Text style={styles.text1}>BMS</Text>
            <Text style={styles.text2}>Vidhyarthi Khaana</Text>
            <Text style={styles.text3}>Create an account</Text>
            <Text style={styles.text4}>Enter your email to sign up</Text>
          </View>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={onChangeSearch}
                label="email@bmsce.ac.in"
                mode="outlined"
                value={subject}
                theme={{
                  colors: {
                    primary: colors.gray2,
                    underlineColor: 'transparent',
                  },
                }}
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <View style={styles.buttonContainer}>
              <Button
                title="Sign up with email"
                onPress={handleSignUpPress}
                color={colors.white}
                labelStyle={{ color: colors.white }}
              />
            </View>
            <Divider text="or continue with" />
            <GoogleButton onPress={handleGoogleSignUp} style={styles.google} />
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.text5}>
              By clicking continue, you agree to our{' '}
              <Text
                style={styles.link}
                onPress={() => console.log('Terms of Service pressed')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.link}
                onPress={() => console.log('Privacy Policy pressed')}
              >
                Privacy Policy
              </Text>
            </Text>
            <Text style={styles.enter} onPress={handleSignInPress}>
              Already have an account? Sign in
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  text1: {
    color: colors.pure,
    fontSize: 32,
    fontWeight: '600',
  },
  text2: {
    color: colors.pure,
    fontSize: 28,
    fontWeight: '600',
  },
  text3: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 70,
  },
  text4: {
    fontSize: 14,
    fontWeight: '400',
  },
  text5: {
    color: '#828282',
    textAlign: 'center',
    bottom: 40,
  },
  
  link: {
    color: colors.black,
  },
  bottomText: {
    paddingLeft: 27,
    paddingRight: 22,
    paddingTop: 5,
    alignItems: 'center',
  },
  inputWrapper: {
    alignItems: 'center',
    paddingBottom: 70,
  },
  inputContainer: {
    width: 327,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    width: 327,
    alignItems: 'center',
  },
  enter: {
    top: 80,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default Focus;
