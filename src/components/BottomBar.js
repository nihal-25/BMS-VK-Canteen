import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Ionicons for icons
import { colors } from '../utils/colors';
const BottomBar = ({ navigation }) => {
  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('MainScreen')}
      >
        <Ionicons name="home-outline" size={24} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('Search')}
      >
        <Ionicons name="search-outline" size={24} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('Cart', { cartItems: [] })}
      >
        <Ionicons name="cart-outline" size={27} color={colors.black} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('Profile')}
      >
        <Ionicons name="person-circle-outline" size={27} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // Example background color
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  button: {
    padding: 10,
  },
});

export default BottomBar;
