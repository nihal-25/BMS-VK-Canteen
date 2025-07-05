import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.about}>ABOUT</Text>
      </View>
      <TouchableOpacity
        style={styles.privacy}
        onPress={() => navigation.navigate("PrivacyPolicy")}
      >
        <Text style={styles.privacyText}>Privacy Policy</Text>
        <View style={styles.privacyButton}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="gray"
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.main}>
        The BMS Vidhyarthi Khaana App is a digital platform designed to enhance
        the dining experience for students, faculty, and staff at BMS College of
        Engineering. Developed with the objective of streamlining canteen
        operations, the app offers a range of functionalities aimed at providing
        convenience and efficiency.{"\n\n"}Features of the app include a
        comprehensive digital menu that allows users to browse through various
        food options available in the canteen. The app enables users to place
        orders directly from their smartphones, reducing the need for standing
        in long queues. Additionally, the app supports multiple payment options,
        including digital wallets and UPI, making transactions seamless and
        cashless.{"\n\n"}The BMS College Canteen App also provides real-time
        updates on order status, ensuring users are informed about the
        preparation and delivery times. Nutritional information and ingredients
        for each menu item are also available, catering to health-conscious
        users. In terms of usability, the app is designed with a user-friendly
        interface, making it accessible to all. Regular feedback mechanisms are
        in place, allowing users to rate their experience and suggest
        improvements. Overall, the BMS Vidhyarthi Khaana App aims to modernize
        the canteen services, offering a convenient and efficient solution for
        the BMS College community.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the items horizontally
    marginBottom: 20,
  },
  about: {
    fontWeight: "800",
    color: colors.pure,
    fontSize: 19,
    marginLeft: 10,
  },
  main: {
    color: colors.newg,
    fontSize: 15,
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
  },
  privacyText: {
    color: colors.gray,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  privacyButton: {
    backgroundColor: "transparent", // Ensure no background color for the button
    padding: 10,
  },
  chevronIcon: {
    marginLeft: 190,
  },
});

export default AboutScreen;
