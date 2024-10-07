import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { insertToMstUser, ValidateUser } from '@/db';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const isDataInserted = await AsyncStorage.getItem('isDataInserted');
        if (isDataInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/getuser');
          const mstuser = response.data.data;
          console.log('====================================');
          console.log('mstuser', mstuser);
          console.log('====================================');

          for (const user of mstuser) {
            await insertToMstUser(user.UserCode, user.UserID, user.LoginPwd, user.UserName);
          }

          await AsyncStorage.setItem('isDataInserted', 'true');
        }
      } catch (error) {
        console.log('====================================');
        console.log('Error fetching users', error);
        console.log('====================================');
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!username) {
      alert('Please enter username');
      return;
    }
    if (!password) {
      alert('Please enter password');
      return;
    }
    console.log('====================================');
    console.log('username', username, 'password', password);
    console.log('====================================');
    const checkUser = await ValidateUser(username, password);
    if (!checkUser) {
      // alert('Invalid credentials');
      return;
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize='none'
        autoComplete='off'
        autoCorrect={false}
        autoFocus={true}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: height * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    paddingVertical: height * 0.010, // Reduced vertical padding
    paddingHorizontal: height * 0.02,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: height * 0.01,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.010, // Reduced vertical padding
    paddingHorizontal: height * 0.02,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    width: '100%',
    padding: height * 0.02,
    marginVertical: height * 0.02,
    backgroundColor: '#0d106e',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});