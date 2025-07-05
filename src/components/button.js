import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

export const Button = ({ style = {}, ...props }) => {
  return (
    <PaperButton
      mode="outlined"
      color="#ffffff"
      uppercase={false} 
      style={[styles.button, style]}
      {...props}
    >
      {props.title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    height: 40,
    width: '100%', 
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default Button;
