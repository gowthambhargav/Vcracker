import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryTable = ({
  basicTotalAmt,
  qDiscPercent,
  qty,
  desc,
  amt,
  subTotal,
  grossAmt,
  cgstPercent,
  cgstAmt,
  sgstPercent,
  sgstAmt,
  igstPercent,
  igstAmt,
  advanceAmt,
  packingCharges,
  othersAmt,
  invoiceValueTotal,
}: {
  basicTotalAmt: number;
  qDiscPercent: number;
  qty: number;
  desc: string;
  amt: number;
  subTotal: number;
  grossAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  igstPercent: number;
  igstAmt: number;
  advanceAmt: number;
  packingCharges: number;
  othersAmt: number;
  invoiceValueTotal: number;
}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Basic Total Amt</Text>
        <Text style={styles.tableCell}>₹{basicTotalAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>QDisc %</Text>
        <Text style={styles.tableCell}>{qDiscPercent.toFixed(2)}%</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Qty</Text>
        <Text style={styles.tableCell}>{qty}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Desc</Text>
        <Text style={styles.tableCell}>{desc}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Amt</Text>
        <Text style={styles.tableCell}>₹{amt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Sub Total</Text>
        <Text style={styles.tableCell}>₹{subTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Gross Amt</Text>
        <Text style={styles.tableCell}>₹{grossAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>CGST ({cgstPercent}%)</Text>
        <Text style={styles.tableCell}>₹{cgstAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>SGST ({sgstPercent}%)</Text>
        <Text style={styles.tableCell}>₹{sgstAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>IGST ({igstPercent}%)</Text>
        <Text style={styles.tableCell}>₹{igstAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Advance Amt</Text>
        <Text style={styles.tableCell}>₹{advanceAmt.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Packing Charges</Text>
        <Text style={styles.tableCell}>₹{packingCharges.toFixed(2)}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Others Amt</Text>
        <Text style={styles.tableCell}>₹{othersAmt.toFixed(2)}</Text>
      </View>
      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
        <Text style={styles.tableCell}>Invoice Value Total</Text>
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