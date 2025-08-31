import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { DevSettings } from "react-native";

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>⚠️ No Internet Connection</Text>
        <Button 
          title="Retry" 
          onPress={() => {
            // Safer: only reload when user clicks Retry
            if (DevSettings?.reload) {
              DevSettings.reload();
            }
          }} 
        />
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
  },
});
