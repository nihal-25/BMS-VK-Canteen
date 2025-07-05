import "react-native-gesture-handler";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { CartProvider } from "./src/context/CartContext";
import { AuthenticationContextProvider } from "./src/service/authentication.context";
import { Navigation } from "./src/navigation/Navigation";
import { LocationProvider } from "./src/screens/LocationContext";

// Import the initialized Firebase services
import { auth, firestore } from "./src/config/firebaseConfig"; 

const App = () => {
  return (
    <PaperProvider>
      <LocationProvider>
        <CartProvider>
          <AuthenticationContextProvider>
            <Navigation />
          </AuthenticationContextProvider>
        </CartProvider>
      </LocationProvider>
    </PaperProvider>
  );
};

export default App;

// import React from "react";
// import { Provider as PaperProvider } from "react-native-paper";
// import { Text, View } from "react-native";
// import { CartProvider } from "./src/context/CartContext";
// import { LocationProvider } from "./src/screens/LocationContext";
// import { AuthenticationContextProvider } from "./src/service/authentication.context";

// export default function App() {
//   return (
//     <PaperProvider>
//       <CartProvider>
//         <LocationProvider>
//           <AuthenticationContextProvider>
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
//               <Text>Hello with Auth!</Text>
//             </View>
//           </AuthenticationContextProvider>
//         </LocationProvider>
//       </CartProvider>
//     </PaperProvider>
//   );
// }

