import React from 'react';
import { SafeAreaView, View, Text, StyleSheet,Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import TickMarkImage from '../assets/tick.png';


const PaymentConfirmationScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <Image source={TickMarkImage} style={styles.image} />
        <Text style={styles.confirmationText}>Payment Confirmed!</Text>
        <Button mode="contained" onPress={() => navigation.navigate('MainScreen')} style={styles.button}>
          Back to Home
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 100, 
    height: 100, 
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor:colors.green,
  },
});

export default PaymentConfirmationScreen;
