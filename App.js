import "react-native-gesture-handler";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { CartProvider } from "./src/context/CartContext";
import { AuthenticationContextProvider } from "./src/service/authentication.context";
import { Navigation } from "./src/navigation/Navigation";
import { LocationProvider } from "./src/screens/LocationContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from "./src/context/NetworkProvider";
// Import the initialized Firebase services
import { auth, firestore } from "./src/config/firebaseConfig"; 

const App = () => {
  return (
  <SafeAreaProvider>
    <PaperProvider>
      <LocationProvider>
        <CartProvider>
          <AuthenticationContextProvider>
          <NetworkProvider>
            <Navigation />
           </NetworkProvider>
          </AuthenticationContextProvider>
        </CartProvider>
      </LocationProvider>
    </PaperProvider>
  </SafeAreaProvider>
  );
};

export default App;

