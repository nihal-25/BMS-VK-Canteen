import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.replace('Focus'); // or any other screen you want to navigate to
  };

  return (
    <Swiper style={styles.wrapper} showsButtons={true}>
      <View style={styles.slide}>
        <Image source={require('../assets/ob3.png')} style={styles.image} />
        <Text style={styles.title}>Welcome to College Canteen</Text>
        <Text style={styles.description}>
          Discover a variety of delicious meals available at your college canteen.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image source={require('../assets/ob2.png')} style={styles.image} />
        <Text style={styles.title}>Order Your Meal</Text>
        <Text style={styles.description}>
          Easily order your favorite meals from the canteen with just a few taps.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image source={require('../assets/ob1.png')} style={styles.image} />
        <Text style={styles.title}>Fast Delivery</Text>
        <Text style={styles.description}>
          Enjoy quick and reliable service of your meals right to your location.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.pure,// Change the color here
    borderRadius: 25, // Change the border radius here
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
