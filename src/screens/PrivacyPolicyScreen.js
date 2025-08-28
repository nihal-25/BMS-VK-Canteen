import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="gray" />
              </TouchableOpacity>

        <Text style={styles.header}>Privacy Policy</Text>

        <Text style={styles.paragraph}>
          We respect your privacy and are committed to protecting the personal information you provide. This policy outlines how we collect, use, and store your data.
        </Text>

        <Text style={styles.subheader}>1. Information Collection</Text>
        <Text style={styles.paragraph}>
          We collect basic information such as your name, email, and order details to improve your user experience and fulfill orders.
        </Text>

        <Text style={styles.subheader}>2. Use of Information</Text>
        <Text style={styles.paragraph}>
          Your data is used solely for processing orders, improving app functionality, and communicating relevant updates.
        </Text>

        <Text style={styles.subheader}>3. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell or share your personal information with third parties. Your data is securely stored and only accessible to authorized personnel.
        </Text>

        <Text style={styles.subheader}>4. Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard measures to protect your data from unauthorized access or misuse.
        </Text>

         <Text style={styles.subheader}>5. Account Deletion</Text>
        <Text style={styles.paragraph}>
          If you wish to delete your account and related data, please use the in-app ‘Delete Account’ option, or contact us at nihal6mn@gmail.com.
        </Text>

        <Text style={styles.subheader}>6. Changes to Policy</Text>
        <Text style={styles.paragraph}>
          This policy may be updated occasionally. Continued use of the app implies acceptance of the updated policy.
        </Text>

        <Text style={styles.paragraph}>
          For questions or concerns, please contact our support team.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:30
  },
  container: {
    paddingHorizontal: 16,
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
    color:colors.pure,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheader: {
    color:colors.pure,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: colors.newg,
    lineHeight: 20,
    marginBottom: 10,
  },
});
