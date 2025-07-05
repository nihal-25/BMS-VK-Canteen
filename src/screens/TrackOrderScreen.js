import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Divider } from 'react-native-paper';
import { colors } from "../utils/colors";

const TrackOrderScreen = () => {
  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>TRACK ORDER</Text>
        </View>
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.subheader}>Your order is being prepared!</Text>
        <Divider style={styles.divider} />

        <Image 
          source={{ uri: '' }} 
          style={styles.gif} 
        />

        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTimeText}>5 - 10 mins</Text>
          <Text style={styles.estimatedTimeSubtext}>Estimated cooking time</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarSection, styles.active]}>
            <Text style={styles.statusText}>Order received</Text>
          </View>
          <View style={styles.progressBarSection}>
            <Text style={styles.statusText}>Order confirmed</Text>
          </View>
          <View style={styles.progressBarSection}>
            <Text style={styles.statusText}>Order being prepared</Text>
          </View>
          <View style={styles.progressBarSection}>
            <Text style={styles.statusText}>Ready for pickup</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>Vidyarthi Khaana Mechanical block</Text>
          <Text style={styles.price}>₹160.75</Text>
          <Text style={styles.orderItem}>- Al Faham Half(1)</Text>
          <Text style={styles.orderItem}>- Chilli Chicken Bowl(1)</Text>
          <Text style={styles.orderItem}>- Veg Friend Maggi(2)</Text>
        </View>

        <Divider style={styles.divider} />

        <Button onPress={() => {}} style={styles.button}>I did not receive this order</Button>
        <Button onPress={() => {}} style={styles.button}>Item(s) delivered are incorrect or wrong</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  gif: {
    width: '100%', 
    height: 250,   
    resizeMode: 'contain',
  },
  estimatedTimeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  estimatedTimeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  estimatedTimeSubtext: {
    fontSize: 14,
    color: 'gray',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItems: 'center',
  },
  progressBarSection: {
    flex: 1,
    height: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingTop: 15,
  },
  active: {
    backgroundColor: '#ff5252',
  },
  statusText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  restaurantInfo: {
    marginVertical: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'gray',
  },
  orderItem: {
    fontSize: 14,
  },
  button: {
    marginVertical: 8,
    color:colors.black,
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    color: '#fd5050',
    textAlign: 'center',
    right:20,
  },
});

export default TrackOrderScreen;
