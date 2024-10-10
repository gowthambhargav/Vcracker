import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Image, StyleSheet } from 'react-native';
import { Provider, Button, Badge } from 'react-native-paper';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown'; // Ensure you are using the correct dropdown component
import { getMstItem, getMstCust, getMstSalesPerson, GetSyncData, insertToCustomerSalesCart, getCustomerSalesCart, syncCustomerSalesCart } from '@/db'; // Adjust the imports as necessary
import CartItem from './CartItem';
import { ToWords } from 'to-words';
import SummaryTable from './SummaryTable';
// import styles from './styles'; // Ensure you have the correct styles imported

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

export default function Main() {
  // set be default value of visible1 and visible2 to first item in the dropdown
  const [visible1, setVisible1] = useState(2)
  const [visible2, setVisible2] = useState(

  );
  const [cartItems, setCartItems] = useState([]);
  const [serialNo, setSerialNo] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [custData, setCustData] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [mstItemNo, setMstItemNo] = useState();

  useEffect(() => {
    (async () => {
      const items = await getMstItem();
      setMstItemNo(items.length);
      setData(items);
      setFilteredData(items);
      const cust = await getMstCust();
      setCustData(cust);
      const sp = await getMstSalesPerson();
      setSalesPerson(sp);
    })();
  }, []);

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
    const currentDate = date.getDate().toString().padStart(2, '0');
    const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

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
      const currentCount = storedCount.toString().padStart(5, '0');
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${currentCount}`;
      setSerialNo(newSerialNo);
    } else {
      const newCount = '00001';
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${newCount}`;
      setSerialNo(newSerialNo);
      await AsyncStorage.setItem('storedData', `${currentDate}-1`);
    }
  };

  const updateSerialNo = async () => {
    const date = new Date();
    const currentDate = date.getDate().toString().padStart(2, '0');
    const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
      const currentCount = (storedCount + 1).toString().padStart(5, '0');
      const newSerialNo = `${yearLastTwoDigits}${month}${currentDate}${deviceID}${currentCount}`;
      setSerialNo(newSerialNo);
      await AsyncStorage.setItem('storedData', `${currentDate}-${storedCount + 1}`);
    } else {
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




  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items to the cart before submitting.');
      return;
    }

    setCartItems([]);
    updateSerialNo();
    console.log('====================================');
    console.log(visible1, visible2, total);
    console.log('====================================');
    const cart =  cartItems.map(item => ({
      ITEMID: item.ITEMID,
      ITEMNAME: item.name,
      ITEMCODEClean: item.ITEMCODEClean,
      ItemPrice: toWords.convert(item.price),
      uomid: item.uomid,
      quantity: item.quantity,
    }))
    const strCart = JSON.stringify(cart);
    console.log('Submit:',);
const date = new Date().toDateString();
const mounth = new Date().getMonth() + 1;
const year = new Date().getFullYear();
   try {
  await  insertToCustomerSalesCart(visible1,visible2 || "Admin",strCart,total,date,mounth,year,serialNo)
   } catch (error) {
    console.log('====================================');
    console.log('error while inserting to customer sales cart',error);
    console.log('====================================');
   }
   await getCustomerSalesCart();
  };

  const handleClear = () => {
    setCartItems([]);
  };

  const handleItemSelect = (value) => {
    const selectedItem = data?.find((item) => item.ITEMCODEClean === value);
    if (!selectedItem) return;

    setCartItems((prevCartItems) => {
      const itemMap = new Map(prevCartItems.map(item => [item.name, item]));
      const existingItem = itemMap.get(selectedItem.ITEMNAME);

      if (existingItem) {
        existingItem.quantity += 1;
        return [...itemMap.values()];
      } else {
        const newItem = {
          id: prevCartItems.length + 1 + Math.random(),
          ITEMID: selectedItem.ITEMID,
          ITEMCODEClean: selectedItem.ITEMCODEClean,
          name: selectedItem.ITEMNAME,
          price: selectedItem.ItemPrice,
          quantity: 1,
          uomid: selectedItem.uomid,
        };
        itemMap.set(newItem.name, newItem);
        return [...itemMap.values()];
      }
    });
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const sgst = subtotal * 0.09; // 9% SGST
    const cgst = subtotal * 0.09; // 9% CGST
    const discount = subtotal * 0.18; // 18% discount
    const total = subtotal - discount + sgst + cgst;
    console.log('====================================');
    console.log(sgst, cgst,subtotal ,total);
    console.log('====================================');
    return { subtotal, sgst, cgst, total };
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const HandelSearch = (text) => {
    setSearchText(text);
    const filtered = data.filter(
      (item) =>
        item.ITEMNAME.toLowerCase().includes(text.toLowerCase()) ||
        item.ITEMCODEClean.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const memoizedFilteredData = useMemo(() => filteredData, [filteredData]);

  const memoizedCartItems = useMemo(() => {
    return cartItems.map((item) => (
      <CartItem key={item.id} item={item} onRemove={handleRemoveItem} onQuantityChange={handleQuantityChange} />
    ));
  }, [cartItems, handleRemoveItem, handleQuantityChange]);

  const { subtotal, total } = calculateTotal();

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Text style={styles.dateText}>Dt: {formatDate(new Date())}</Text>
            <Text style={styles.serialNumberText}>No: {serialNo}</Text>
          </View>
          <Text style={styles.deviceIdText}>Device ID: {deviceID}</Text>
          <TouchableOpacity style={styles.syncButton} onPress={() => {
            syncCustomerSalesCart().then((res) => {}).catch((err) => {});
            GetSyncData().then((res) => {}).catch((err) => {
              console.error('err while syncing in main.tsx', err);
            });
          }}>
            <MaterialIcons name="sync" size={20} color="#fff" />
            <Text style={styles.syncText}>Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCartModalVisible(true)} style={styles.cartIconContainer}>
            <FontAwesome6 name="cart-shopping" size={24} color="#0d106e" />
            {cartItems.length > 0 && (
              <Badge style={styles.badge}>{cartItems.length}</Badge>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={custData}
            labelField="CustCodeClean"
            valueField="CustName"
            placeholder="Select Customer"
            searchPlaceholder="Search..."
            value={visible1}
            onChange={(item) => setVisible1(item.CUSTID)}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={salesPerson}
            labelField="SP"
            valueField="SP"
            placeholder="Select Sales Person"
            search
            searchPlaceholder="Search..."
            value={visible2}
            onChange={(item) => setVisible2(item.SP)}
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
            Save/Print
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
              <Text style={styles.modalTitle}>Select Items({mstItemNo})</Text>
              <View style={{ width: "100%", paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  placeholder="Search items"
                  style={{ flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, marginBottom: 10, padding: 5 }}
                  onChangeText={HandelSearch}
                  value={searchText}
                />
                <TouchableOpacity onPress={() => setCartModalVisible(true)} style={{ marginLeft: 10 }}>
                  <FontAwesome6 name="cart-shopping" size={24} color="#0d106e" />
                  {cartItems.length > 0 && (
                    <Badge style={styles.badge}>{cartItems.length}</Badge>
                  )}
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={styles.cardContainer}>
                  {memoizedFilteredData.map((item) => (
                    <TouchableOpacity
                      key={item?.ITEMID}
                      style={styles.card}
                      onPress={() => handleItemSelect(item?.ITEMCODEClean)}
                    >
                      <Image source={require("../assets/images/crackericon.png")} style={styles.cardImage} />
                      <Text style={styles.cardText}>{item.ITEMNAME}</Text>
                      <Text style={[styles.cardPrice, { color: "#fff" }]}>₹{item.ItemPrice}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: '#0d106e', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5, marginTop: 10 }}>
                  <Text style={{ color: '#fff', textAlign: "center" }}>Close</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                  <Button mode="contained" buttonColor="#0d106e" textColor="white" onPress={handleSubmit} style={styles.button}>
                    Save/Print
                  </Button>
                  <Button mode="outlined" textColor="#0d106e" onPress={handleClear} style={styles.button}>
                    Clear
                  </Button>
                </View>
              </View>
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
                {memoizedCartItems}
              </ScrollView>
              <Text style={styles.modalTitle}>Total: ₹{total.toFixed(2)}</Text>
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => setCartModalVisible(false)} style={{ backgroundColor: '#0d106e', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5, marginTop: 10 }}>
                  <Text style={{ color: '#fff' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  item1: {
    alignSelf: 'flex-start', // Align first item to the start
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  item2: {
    alignSelf: 'center', // Center the second item
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#d0d0d0',
  },
  item3: {
    alignSelf: 'flex-end', // Align third item to the end
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#b0b0b0',
  },

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
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
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
    // padding: 20,
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
  cardContainer: {
    flexDirection: 'row',
    width:"100%",
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#0d106e',
    borderRadius: 10,
    padding: 2,
    margin: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.5,
    elevation: 5,
    width: 100, // Adjust the width as needed
  },
  cardImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  cardPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});