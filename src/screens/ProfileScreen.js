import React, { useState, useContext, useEffect,useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image,Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationContext } from "../service/authentication.context";
import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userDetails, setUserDetails] = useState({ name: '', email: '', profilePicture: '' });
  const { setUser } = useContext(AuthenticationContext); // Access the setUser function from the context
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (navigation.isFocused()) {
      const params = navigation.getState().routes.find(route => route.name === "Profile")?.params;
      if (params?.updatedFields) {
        setUserDetails(prevDetails => ({ ...prevDetails, ...params.updatedFields }));
      }
    }
  }, [navigation]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const auth = getAuth();
        const firestore = getFirestore();
        const user = auth.currentUser;

        if (user) {
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            Alert.alert("Error", "No such user!");
          }
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              const auth = getAuth();
              await signOut(auth);
              console.log("Sign out successful");
  
              try {
                const keys = await AsyncStorage.getAllKeys();
                if (keys.length > 0) {
                  await AsyncStorage.multiRemove(keys);
                  console.log("AsyncStorage keys removed");
                } else {
                  console.log("No keys in AsyncStorage to remove");
                }
              } catch (error) {
                console.error("Failed to clear AsyncStorage:", error);
                Alert.alert("Storage Error", "Failed to clear storage. Please try again.");
              }
  
              if (typeof setUser === "function") {
                setUser(null);
                console.log("User set to null");
              } else {
                console.error("setUser is not a function");
              }
  
              navigation.navigate("Focus");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", error.message);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };
  const handleAboutPress = () => {
    navigation.navigate("About");
  };
  const handleHelpFaqPress = () => {
    navigation.navigate("HelpFaq");
  };

  const handleSendFeedbackPress = () => {
    navigation.navigate("SendFeedback");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all related data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const auth = getAuth();
              const firestore = getFirestore();
              const user = auth.currentUser;

              if (user) {
                // Delete user document from Firestore
                await deleteDoc(doc(firestore, "users", user.uid));

                // Delete user from Firebase Authentication
                await deleteUser(user);

                // Clear AsyncStorage
                const keys = await AsyncStorage.getAllKeys();
                if (keys.length > 0) {
                  await AsyncStorage.multiRemove(keys);
                }

                // Reset user in context
                if (typeof setUser === "function") {
                  setUser(null);
                }

                Alert.alert("Account Deleted", "Your account has been permanently deleted.");
                navigation.navigate("Focus");
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };
   const translateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>
      <View style={styles.profileBox}>
        <View style={styles.profileContainer}>
          <View style={styles.profileDetails}>
            <Text style={styles.name}>{userDetails.name}</Text>
            <Text style={styles.email}>{userDetails.email}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editProfile}>Edit Profile {">"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileImage}>
            {userDetails.profilePicture ? (
              <Image source={{ uri: userDetails.profilePicture }} style={styles.image} />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>{getInitials(userDetails.name)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyOrders')}>
          <Ionicons name="time-outline" size={35} color="gray" />
          <Text style={styles.buttonsContainerText}>My orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CurrentOrders')}>
          <Ionicons name="card-outline" size={35} color="gray" />
          <Text style={styles.buttonsContainerText}>Current Orders</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color="gray"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSendFeedbackPress}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={26}
              color="gray"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Send feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem} onPress={handleHelpFaqPress}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="help-circle-outline"
              size={26}
              color="gray"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Help & FAQs</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="trash-outline"
              size={26}
              color="gray"
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: "red" }]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="log-out-outline"
              size={26}
              color="gray"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Log out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.bottomBar, { transform: [{ translateY}],paddingBottom: insets.bottom, }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
        >
          <Ionicons name="home-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart", { cartItems: [] })}
        >
          <Ionicons name="cart-outline" size={27} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={27}
            color={colors.black}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const MenuItem = ({ title, icon }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        {icon && (
          <Ionicons
            name={icon}
            size={26}
            color="gray"
            style={styles.menuIcon}
          />
        )}
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileBox: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 8,
    margin: 20,
    marginTop: 50,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.pure,
  },
  email: {
    color: "gray",
  },
  editProfile: {
    color: "gray",
    fontWeight: "bold",
  },
  profileImage: {
    marginLeft: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  initialsContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
    height: 75,
  },
  buttonsContainerText: {
    color: colors.newg,
  },
  button: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    margin: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#fd5050",
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  bottomBarButton: {
    alignItems: "center",
  },
  
});

export default ProfileScreen;
