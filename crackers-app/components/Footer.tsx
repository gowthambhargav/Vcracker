import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Designed by</Text>
      <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0d106e', // Background color to match the header

  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
});