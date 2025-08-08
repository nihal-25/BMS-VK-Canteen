import React from 'react';
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useCart } from '../context/CartContext'; 
import { colors } from '../utils/colors';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useLocation } from './LocationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CartScreen = () => {
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, clearCart } = useCart(); 
  const navigation = useNavigation();
  const firestore = getFirestore();
  const { locationId } = useLocation() ;
  
  const handlePay = async () => {
    if (cart.length === 0) {
      Alert.alert("Error", "No items in cart");
      return;
    }
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert("Error", "You must be logged in to place an order.");
      return;
    }
  
    const cleanedCart = cart.map(item => ({
      FoodName: item.FoodName || "Unknown",
      FoodPrice: item.FoodPrice || 0,
      quantity: item.quantity || 1,
      FoodImageUrl: item.FoodImageUrl || "",
      InStock: item.InStock || "false"
    }));
  
    const total = cleanedCart.reduce((acc, item) => acc + item.FoodPrice * item.quantity, 0).toFixed(2);
  
    try {
      // 1. Add to 'payments'
      const orderRef = await addDoc(collection(firestore, "payments"), {
        cart: cleanedCart,
        total,
        timestamp: new Date(),
        status: "paid",
        userId: user.uid,
        location: locationId,
      });
  
      // 2. Add to user's 'currentOrders'
      await setDoc(
        doc(firestore, "userOrders", user.uid, "currentOrders", orderRef.id),
        {
          cart: cleanedCart,
          total,
          timestamp: new Date(),
          status: "paid",
          location: locationId,
        }
      );
  
      clearCart();
      navigation.navigate("PaymentConfirmation");
    } catch (error) {
      console.error("Error adding document:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };
  

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.FoodImageUrl }} style={styles.cartItemImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cartItemTitle}>{item.FoodName}</Text>
        <Text style={styles.cartItemPrice}>₹{(item.FoodPrice * item.quantity).toFixed(2)}</Text>
      </View>
      <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
      <Button onPress={() => removeFromCart(item)}>Remove</Button>
    </View>
  );

  return (
  <SafeAreaView style={styles.container}>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Cart" />
    </Appbar.Header>

    <FlatList
      data={cart}
      renderItem={renderCartItem}
      keyExtractor={(item) => item.FoodName}
      contentContainerStyle={styles.cartList}
      ListEmptyComponent={
        <Text style={styles.emptyCartText}>Your cart is empty. Add some items!</Text>
      }
    />

    <View style={styles.cartTotal}>
      <Text style={styles.cartTotalText}>Total:</Text>
      <Text style={styles.cartTotalAmount}>
        ₹{cart.reduce((acc, item) => acc + item.FoodPrice * item.quantity, 0).toFixed(2)}
      </Text>
    </View>

    <Button
      mode="contained"
      onPress={handlePay}
      style={{...styles.proceedButton,paddingBottom: insets.bottom}}
      disabled={cart.length === 0}
    >
      Proceed to Pay
    </Button>
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 25,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartText: {
  textAlign: 'center',
  marginTop: 40,
  fontSize: 16,
  color: 'gray',
},

  cartItemPrice: {
    fontSize: 14,
    color: '#777',
  },
  cartItemQuantity: {
    fontSize: 16,
    marginLeft: 'auto',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  proceedButton: {
    color:colors.gray,
    marginBottom: 26,
    margin: 10,
    padding: 10,
    backgroundColor: colors.pure,
  },
});

export default CartScreen;
