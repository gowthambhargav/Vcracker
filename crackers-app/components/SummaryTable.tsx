import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryTable = ({ subtotal, tax, discount, total }:{
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Subtotal</Text>
        <Text style={styles.tableCell}>₹{subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Tax (10%)</Text>
        <Text style={styles.tableCell}>₹{tax.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Discount (5%)</Text>
        <Text style={styles.tableCell}>-₹{discount.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Total</Text>
        <Text style={styles.tableCell}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
  },
});

export default SummaryTable;