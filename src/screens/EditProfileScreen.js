import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthenticationContext } from "../service/authentication.context";
import { colors } from "../utils/colors";

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { user, setUser } = useContext(AuthenticationContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const auth = getAuth();
        const firestore = getFirestore();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const docRef = doc(firestore, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
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

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const firestore = getFirestore();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const docRef = doc(firestore, 'users', currentUser.uid);
        const updatedFields = {
          name: name || '',
          email: email || '',
          phone: phone || '',
        };
  
        await updateDoc(docRef, updatedFields);
  
        setUser({
          ...user,
          ...updatedFields,
        });
  
        Alert.alert("Success", "Profile updated successfully!");
        navigation.navigate("Profile", { updatedFields });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:45,
    backgroundColor: "white",
  },
  backButton: {
    paddingTop:12,
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fd5050",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.pure,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#fd5050",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfileScreen;
