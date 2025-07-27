// screens/LocationSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocation } from './LocationContext'; // Adjust the path if needed
import { colors } from '../utils/colors';

const LocationSelectionScreen = ({ navigation }) => {
  const { setLocationId } = useLocation();

  const selectLocation = (locationId) => {
    setLocationId(locationId); // Set location in context
    navigation.replace('MainScreen'); // No need to pass as param anymore
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Location</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => selectLocation('FoodData')}>
        <Text style={styles.loc}>Vidhyarthi Khaana(Law)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => selectLocation('FoodData2')}>
        <Text style={styles.loc}>Vidhyarthi Khaana(Sports)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, color:colors.pure},
  button: {
    padding: 15,
    backgroundColor: colors.pure,
    marginVertical: 10,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    
  },
  loc:{
    color:'#FFFFFF',
  }
});

export default LocationSelectionScreen;
