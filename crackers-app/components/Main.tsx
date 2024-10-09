import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Provider, Button } from 'react-native-paper';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import CartItem from './CartItem'; // Import the CartItem component
import { ScrollView } from 'react-native-gesture-handler';
import SummaryTable from './SummaryTable';

export default function Main() {
  const [visible1, setVisible1] = useState(null);
  const [visible2, setVisible2] = useState(null);
  const [visible3, setVisible3] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const deviceId = 'deviceid00001';
  const serialNumber = new Date().toISOString().slice(2, 10).replace(/-/g, '') + deviceId;

  const data = [
    { label: 'Option 1', value: '1', price: 20.0 },
    { label: 'Option 2', value: '2', price: 25.0 },
    { label: 'Option 3', value: '3', price: 30.0 },
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

  const handleQuantityChange = (id, quantity) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items to the cart before submitting.');
      return;
    }
    setCartItems([]);
    setVisible3([]);
    // Handle submit logic here
    console.log('Submit:', cartItems);
  };

  const handleClear = () => {
    setCartItems([]);
    setVisible3([]);
    setVisible1(null);
    setVisible2(null);
  };

  const handleMultiSelectChange = (selectedItems) => {
    setCartItems(prevCartItems => {
      const newItems = selectedItems.map(value => {
        const selectedItem = data.find(item => item.value === value);
        const existingItem = prevCartItems.find(item => item.name === selectedItem.label);

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
      const updatedCartItems = prevCartItems.filter(item => 
        newItems.some(newItem => newItem.name === item.name)
      );

      // Merge newItems with updatedCartItems, avoiding duplicates
      const mergedItems = [...updatedCartItems];
      newItems.forEach(newItem => {
        const index = mergedItems.findIndex(item => item.name === newItem.name);
        if (index !== -1) {
          mergedItems[index] = newItem;
        } else {
          mergedItems.push(newItem);
        }
      });

      return mergedItems;
    });
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const discount = subtotal * 0.05; // Assuming 5% discount
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const { subtotal, tax, discount, total } = calculateTotal();

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
            placeholder="Select Customer"
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
            placeholder="Select Sales Person"
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
            placeholder="Select Items"
            search
            searchPlaceholder="Search..."
            value={visible3}
            onChange={item => {
              setVisible3(item || []);
              handleMultiSelectChange(item || []);
            }}
            renderSelectedItem={() => <></>} // Hide selected items
          />
        </View>
        <ScrollView style={styles.cartContainer}>
          <View style={{ paddingHorizontal: 5 }}>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} onRemove={handleRemoveItem} onQuantityChange={handleQuantityChange} />
            ))}
          </View>
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