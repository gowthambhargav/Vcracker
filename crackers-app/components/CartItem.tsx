import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CartItem = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQuantity}>
            <MaterialIcons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={incrementQuantity}>
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <MaterialIcons name="delete" size={24} color="red" onPress={() => onRemove(item.id)} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8, // Decreased vertical padding
  },
  itemDetails: {
    flexDirection: 'column',
    flex: 1, // Ensure itemDetails takes available space
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap', // Allow text to wrap
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default CartItem;