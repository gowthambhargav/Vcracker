import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryTable = ({
  invoiceValueTotal,
}: {
  invoiceValueTotal: number;
}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
        <Text style={styles.tableCell}>Total</Text>
        <Text style={styles.tableCell}>₹{invoiceValueTotal.toFixed(2)}</Text>
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