import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { insertToMstUser, ValidateUser, insertMstItem, insertMstCust, insertMstSalesPerson, truncateMstSalesPerson, insertToMstCompany, getMstUser } from '@/db';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import CheckBox from 'expo-checkbox';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const isDataInserted = await AsyncStorage.getItem('isDataInserted');
        console.log('isDataInserted:', isDataInserted); // Debugging

        if (isDataInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/getuser');
          const mstuser = response.data.data;
          console.log('mstuser:', mstuser); // Debugging

          for (const user of mstuser) {
            await insertToMstUser(user.UserCode, user.UserID, user.LoginPwd, user.UserName);
          }

          await AsyncStorage.setItem('isDataInserted', 'true');
        }

        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        console.log('Saved credentials:', { savedUsername, savedPassword, savedRememberMe }); // Debugging

        if (savedRememberMe === 'true') {
          setUsername(savedUsername || '');
          setPassword(savedPassword || '');
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error fetching users', error);
        await AsyncStorage.setItem('isDataInserted', 'false');
      }

      // Fetch and insert items
      try {
        const isItemsInserted = await AsyncStorage.getItem('isItemsInserted');
        console.log('isItemsInserted:', isItemsInserted); // Debugging

        if (isItemsInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/items');
          const items = response.data.data;
          console.log('====================================');
          console.log('items:', items.length); // Debugging
          console.log('====================================');

          for (const item of items) {
            await insertMstItem(item.ITEMID, item.ITEMNAME, item.ITEMCODEClean, item.ItemPrice, item.uomid);
          }

          await AsyncStorage.setItem('isItemsInserted', 'true');
        }
      } catch (error) {
        console.log('Error fetching items', error);
        await AsyncStorage.setItem('isItemsInserted', 'false');
      }

      // Fetch and insert customers
      try {
        const isCustomersInserted = await AsyncStorage.getItem('isCustomersInserted');
        console.log('isCustomersInserted:', isCustomersInserted); // Debugging

        if (isCustomersInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/mstcust');
          const customers = response.data.data;
          console.log('====================================');
          console.log('customers:', customers.length); // Debugging
          console.log('====================================');

          for (const customer of customers) {
            await insertMstCust(customer.CUSTCODE, customer.CustCodeClean, customer.CustName, customer.CUSTID);
          }

          await AsyncStorage.setItem('isCustomersInserted', 'true');
        }
      } catch (error) {
        console.log('Error fetching customers', error);
        await AsyncStorage.setItem('isCustomersInserted', 'false');
      }

      try {
        const isSalesInserted = await AsyncStorage.getItem('isSalesInserted');
        console.log('isSalesInserted:', isSalesInserted); // Debugging

        if (isSalesInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/getsp');
          const sales = response.data.data;
          console.log('====================================');
          console.log('sales:', sales, sales.length); // Debugging
          console.log('====================================');

          await insertMstSalesPerson(sales[0].SP);

          await AsyncStorage.setItem('isSalesInserted', 'true');
        }
      } catch (error) {
        await AsyncStorage.setItem('isSalesInserted', 'false');
        console.log('====================================');
        console.log('Error in insertMstItem', error);
        console.log('====================================');
      }

      try {
        const isCompanyInserted = await AsyncStorage.getItem('isCompanyInserted');
        console.log('isCompanyInserted:', isCompanyInserted); // Debugging
        console.log('====================================');
        console.log("inserting");
        console.log('====================================');
        if (isCompanyInserted !== 'true') {
          const response = await axios.get('http://192.168.1.146:3000/api/getcompany');
          const company = response.data.data;
          console.log('====================================');
          console.log('company:', company, company.length); // Debugging
          console.log('====================================');
          for (const comp of company) {
            await insertToMstCompany(
              comp.CompID,         // Corrected property name
              comp.CompName,       // Corrected property name
              comp.Address1,       // Corrected property name
              comp.Address2,       // Corrected property name
              comp.Address3,       // Corrected property name
              comp.Custcode,       // Corrected property name
              comp.EMAIL,          // Corrected property name
              comp.MOBNO,          // Corrected property name
              comp.WEB,            // Corrected property name
              comp.GSTNO,          // Corrected property name
              comp.CompLoc,        // Corrected property name
              comp.CINNO,          // Corrected property name
              comp.TELNO           // Corrected property name
            );
          }
          await AsyncStorage.setItem('isCompanyInserted', 'true');
        }
      } catch (error) {
        await AsyncStorage.setItem('isCompanyInserted', 'false');
        console.log('====================================');
        console.log('Error in insertToMstCompany', error);
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
    const getUsers = await getMstUser();
    console.log('====================================');
    console.log(getUsers);
    console.log('====================================');
    console.log('Attempting login with:', { username, password }); // Debugging
    const checkUser = await ValidateUser(username, password);

console.log('====================================');
console.log('checkUser:', checkUser); // Debugging
console.log('====================================');
    if (!checkUser) {
      alert('Invalid credentials');
      return;
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('rememberMe', 'false');
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home', params: { user: checkUser } }],
        })
      );
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
      <View style={{ marginRight: "auto" }}>
        <View style={styles.rememberMeContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
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