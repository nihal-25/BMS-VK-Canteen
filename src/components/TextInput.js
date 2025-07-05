import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const TextInput = ({ style = {}, ...props }) => {
  return (
    <PaperTextInput
      mode="outlined"
      style={[styles.input, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    height: 60,
    backgroundColor: '#ffffff',
  },
});
