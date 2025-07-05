import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider= ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10, 
    marginHorizontal: 34,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6E6E6',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#828282',
  },
});

export default Divider;
