// screens/LocationSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocation } from './LocationContext'; // Adjust the path if needed

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
        <Text>Location A</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => selectLocation('FoodData2')}>
        <Text>Location B</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: {
    padding: 15,
    backgroundColor: '#ddd',
    marginVertical: 10,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
});

export default LocationSelectionScreen;
