import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const GoogleButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} >
      <Image
        source={{ uri: 'https://cdn2.hubspot.net/hubfs/53/image8-2.jpg' }} 
        style={styles.logo}
      />
      <Text style={styles.text}>Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    paddingVertical: 9,
    paddingHorizontal: 125,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    top:5,
    
  },
  logo: {
    width: 20, 
    height: 20, 
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight:'600',
    color: colors.black,
  },
});

export default GoogleButton;
