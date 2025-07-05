import "react-native-gesture-handler";
import React from 'react';
import { colors } from '../utils/colors';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import Focus from '../features/Focus';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LocationSelectionScreen from '../screens/LocationSelectionScreen'; // ⬅️ NEW
import MainScreen from '../screens/MainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import DrinksListScreen from '../screens/DrinksListScreen';
import CartScreen from '../screens/CartScreen';
import BreakfastListScreen from '../screens/BreakfastListScreen';
import SearchScreen from '../screens/SearchScreen';
import ChineseDishesScreen from '../screens/ChineseDishesScreen';
import ShortEatsScreen from '../screens/ShortEatsScreen';
import OnboardingScreen from '../screens/OnboardingScreen1';
import EditProfileScreen from '../screens/EditProfileScreen';
import PaymentConfirmationScreen from '../screens/PaymentConfirmationScreen';
import MyOrdersScreen from "../screens/MyOrdersScreen";
import CurrentOrdersScreen from "../screens/CurrentOrdersScreen";
import HelpFaqScreen from "../screens/HelpFaqScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import SendFeedbackScreen from "../screens/SendFeedbackScreen";

const Stack = createStackNavigator();

export const AccountNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="Focus" component={Focus} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      
      {/* 👇 Location selection after auth */}
      <Stack.Screen name="LocationSelect" component={LocationSelectionScreen} />

      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          title: "Main Screen",
          headerStyle: { backgroundColor: colors.pure },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="DrinksList" component={DrinksListScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="BreakfastList" component={BreakfastListScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ChineseDishes" component={ChineseDishesScreen} />
      <Stack.Screen name="ShortEats" component={ShortEatsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="CurrentOrders" component={CurrentOrdersScreen} />
      <Stack.Screen name="HelpFaq" component={HelpFaqScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="SendFeedback" component={SendFeedbackScreen} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
