import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SendFeedbackScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:vk-bms@gmail.com');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Send Feedback</Text>
        <Text style={styles.message}>
          For any queries or concerns, please reach out to us at:
        </Text>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.email}>vk-bms@gmail.com</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          We value your feedback and will get back to you as soon as possible.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SendFeedbackScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
});
