import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Browse through categories, add items to your cart, and tap 'Checkout' to place your order.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders once placed cannot be cancelled. Please reach out to the staff for urgent issues.",
  },
  {
    question: "Where can I see my past orders?",
    answer: "Go to the 'My Orders' section under your profile to see all current and past orders.",
  },
  {
    question: "What if an item is out of stock?",
    answer: "If an item is out of stock, you won’t be able to add it to your cart.",
  },
  {
    question: "Is payment handled through the app?",
    answer: "Currently, payments are made in person at the canteen counter.",
  },
];

const HelpFaqScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Help & FAQ</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <View style={styles.iconRow}>
              <Ionicons name="help-circle-outline" size={20} color="#333" style={styles.icon} />
              <Text style={styles.question}>{faq.question}</Text>
            </View>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpFaqScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
  },
  answer: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
