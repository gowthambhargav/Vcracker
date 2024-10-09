import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Provider, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import CartItem from './CartItem'; // Import the CartItem component
import { ScrollView } from 'react-native-gesture-handler';
import SummaryTable from './SummaryTable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const data = [
  { label: 'Option 1', value: '1', price: 10 },
  { label: 'Option 2', value: '2', price: 20 },
  { label: 'Option 3', value: '3', price: 30 },
  // Add more options as needed
];

export default function Main() {
  const [visible1, setVisible1] = useState(null);
  const [visible2, setVisible2] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [serialNo, setSerialNo] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  useEffect(() => {
    const fetchDeviceID = async () => {
      try {
        const storedDeviceID = await AsyncStorage.getItem('deviceID');
        if (storedDeviceID) {
          setDeviceID(storedDeviceID);
          initializeSerialNo(storedDeviceID);
        } else {
          const response = await fetch('http://192.168.1.146:3000/api/getdeviceid');
          const result = await response.json();
          console.log('====================================');
          console.log('Device ID:', result, response);
          console.log('====================================');
          const deviceID = result.data;
          await AsyncStorage.setItem('deviceID', deviceID);
          setDeviceID(deviceID);
          initializeSerialNo(deviceID);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch device ID');
      }
    };

    fetchDeviceID();
  }, []);

  const initializeSerialNo = async (deviceID) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const date = new Date();
    const currentDate = date.getDate().toString().padStart(2, '0'); // Ensure date is in 'dd' format
    const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is in 'MM' format

    // Introduce a delay of 2 seconds
    await delay(2000);

    if (!deviceID) {
      Alert.alert('Device ID not found', 'Please restart the app', [{ text: 'OK' }]);
      return;
    }

    const storedData = await AsyncStorage.getItem('storedData');
    let storedDate, storedCount;

    if (storedData) {
      [storedDate, storedCount] = storedData.split('-').map(Number);
    }

    if (storedDate === parseInt(currentDate)) {
      // Same day, use the stored count
      const currentCount = storedCount.toString().padStart(5, '0');
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${currentCount}`;
      setSerialNo(newSerialNo);
    } else {
      // New day, reset the count
      const newCount = '00001';
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${newCount}`;
      setSerialNo(newSerialNo);
      await AsyncStorage.setItem('storedData', `${currentDate}-1`);
    }
  };

  const updateSerialNo = async () => {
    const date = new Date();
    const currentDate = date.getDate().toString().padStart(2, '0'); // Ensure date is in 'dd' format
    const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is in 'MM' format
    const deviceID = await AsyncStorage.getItem('deviceID');

    if (!deviceID) {
      Alert.alert('Device ID not found', 'Please restart the app', [{ text: 'OK' }]);
      return;
    }

    const storedData = await AsyncStorage.getItem('storedData');
    let storedDate, storedCount;

    if (storedData) {
      [storedDate, storedCount] = storedData.split('-').map(Number);
    }

    if (storedDate === parseInt(currentDate)) {
      // Same day, increment the count
      const currentCount = (storedCount + 1).toString().padStart(5, '0');
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${currentCount}`;
      setSerialNo(newSerialNo);
      await AsyncStorage.setItem('storedData', `${currentDate}-${storedCount + 1}`);
    } else {
      // New day, reset the count
      const newCount = '00001';
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${newCount}`;
      setSerialNo(newSerialNo);
      await AsyncStorage.setItem('storedData', `${currentDate}-1`);
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items to the cart before submitting.');
      return;
    }
    setCartItems([]);
    updateSerialNo();
    // Handle submit logic here
    console.log('Submit:', cartItems);
  };

  const handleClear = () => {
    setCartItems([]);
    setVisible1(null);
    setVisible2(null);
  };

  const handleItemSelect = (selectedItems) => {
    setCartItems((prevCartItems) => {
      const newItems = selectedItems.map((value) => {
        const selectedItem = data.find((item) => item.value === value);
        const existingItem = prevCartItems.find((item) => item.name === selectedItem.label);

        if (existingItem) {
          return existingItem;
        } else {
          return {
            id: prevCartItems.length + 1 + Math.random(), // Generate a unique id
            name: selectedItem.label,
            price: selectedItem.price,
            quantity: 1,
          };
        }
      });

      // Remove items that are no longer selected
      const updatedCartItems = prevCartItems.filter((item) =>
        newItems.some((newItem) => newItem.name === item.name)
      );

      // Merge newItems with updatedCartItems, avoiding duplicates
      const mergedItems = [...updatedCartItems];
      newItems.forEach((newItem) => {
        const index = mergedItems.findIndex((item) => item.name === newItem.name);
        if (index !== -1) {
          mergedItems[index] = newItem;
        } else {
          mergedItems.push(newItem);
        }
      });

      return mergedItems;
    });
    setModalVisible(false);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const discount = subtotal * 0.05; // Assuming 5% discount
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { subtotal, tax, discount, total } = calculateTotal();

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Text style={styles.dateText}>Dt: {formatDate(new Date())}</Text>
            <Text style={styles.serialNumberText}>No: {serialNo}</Text>
          </View>
          <Text style={styles.deviceIdText}>Device ID: {deviceID}</Text>
          <TouchableOpacity style={styles.syncButton}>
            <MaterialIcons name="sync" size={20} color="#fff" />
            <Text style={styles.syncText}>Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCartModalVisible(true)}>
            <FontAwesome6 name="cart-shopping" size={24} color="#0d106e" />
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select Customer"
            search
            searchPlaceholder="Search..."
            value={visible1}
            onChange={(item) => setVisible1(item.value)}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select Sales Person"
            search
            searchPlaceholder="Search..."
            value={visible2}
            onChange={(item) => setVisible2(item.value)}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <FontAwesome6 name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Select items</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.cartContainer}>
          <SummaryTable
            basicTotalAmt={subtotal}
            qDiscPercent={5}
            qty={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            desc="Sample Description"
            amt={subtotal}
            subTotal={subtotal}
            grossAmt={subtotal}
            cgstPercent={9}
            cgstAmt={subtotal * 0.09}
            sgstPercent={9}
            sgstAmt={subtotal * 0.09}
            igstPercent={18}
            igstAmt={subtotal * 0.18}
            advanceAmt={0}
            packingCharges={0}
            othersAmt={0}
            invoiceValueTotal={total}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button mode="contained" buttonColor="#0d106e" textColor="white" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
          <Button mode="outlined" textColor="#0d106e" onPress={handleClear} style={styles.button}>
            Clear
          </Button>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Items</Text>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.modalItem}
                  onPress={() => handleItemSelect([item.value])}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={cartModalVisible}
          onRequestClose={() => setCartModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cart Items</Text>
              <ScrollView style={styles.cartContainer}>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={handleRemoveItem} onQuantityChange={handleQuantityChange} />
                ))}
              </ScrollView>
              <Button onPress={() => setCartModalVisible(false)}>Close</Button>
            </View>
          </View>
        </Modal>
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
  requiredLabel: {
    color: 'red',
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d106e',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  cartContainer: {
    width: '100%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
});