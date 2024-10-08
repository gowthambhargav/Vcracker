import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Provider, Button } from 'react-native-paper';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import CartItem from './CartItem'; // Import the CartItem component
import { ScrollView } from 'react-native-gesture-handler';

export default function Main() {
  const [visible1, setVisible1] = useState(null);
  const [visible2, setVisible2] = useState(null);
  const [visible3, setVisible3] = useState([]);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Item 1', price: 10.0 },
    { id: 2, name: 'Item 2', price: 15.0 },
    { id: 3, name: 'Item 3', price: 10.0 },
    { id: 4, name: 'Item 4', price: 15.0 },
    { id: 5, name: 'Item 5', price: 10.0 },
    { id: 6, name: 'Item 6', price: 15.0 },
  ]);

  const deviceId = 'deviceid00001';
  const serialNumber = new Date().toISOString().slice(2, 10).replace(/-/g, '') + deviceId;

  const data = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date).replace(/\//g, '-');
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Submit:', cartItems);
  };

  const handleClear = () => {
    setCartItems([]);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Text style={styles.dateText}>Dt: {formatDate(new Date())}</Text>
            <Text style={styles.serialNumberText}>No: {serialNumber}</Text>
          </View>
          <Text style={styles.deviceIdText}>Device ID: {deviceId}</Text>
          <TouchableOpacity style={styles.syncButton}>
            <MaterialIcons name="sync" size={24} color="#fff" />
            <Text style={styles.syncText}>Sync</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select Option 1"
            search
            searchPlaceholder="Search..."
            value={visible1}
            onChange={item => setVisible1(item.value)}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select Option 2"
            search
            searchPlaceholder="Search..."
            value={visible2}
            onChange={item => setVisible2(item.value)}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <MultiSelect
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select Option 3"
            search
            searchPlaceholder="Search..."
            value={visible3}
            onChange={item => setVisible3(item || [])}
            renderSelectedItem={() => <></>} // Hide selected items
          />
        </View>
        <ScrollView style={styles.cartContainer}>
       <View style={{paddingHorizontal:5}}>
       {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
       </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button mode="contained" buttonColor='#0d106e' textColor='white' onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
          <Button mode="outlined" textColor='#0d106e' onPress={handleClear} style={styles.button}>
            Clear
          </Button>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 20,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  deviceIdText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serialNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d106e',
    padding: 5,
    borderRadius: 5,
  },
  syncText: {
    color: '#fff',
    marginLeft: 5,
  },
  dropdownContainer: {
    marginVertical: 5,
    width: '100%',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  cartContainer: {
    width: '100%',
    // marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});