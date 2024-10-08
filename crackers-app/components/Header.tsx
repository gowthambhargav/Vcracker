import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Menu, Provider, Appbar } from 'react-native-paper';
import { useNavigation } from 'expo-router';

export default function Header() {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const navigation = useNavigation();
  return (
    <Provider>
      <Appbar.Header style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.companyName}>COMPANY NAME</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={styles.profileContainer}>
              <Text style={styles.profileText}>AB</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {
             /* Handle logout */ 
             navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
             }} title="Logout" />
        </Menu>
      </Appbar.Header>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0d106e', // Explicitly set the background color
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Optional: Add a border color
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  companyName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#0d106e',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});