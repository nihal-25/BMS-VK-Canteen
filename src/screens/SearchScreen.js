import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Searchbar, Button } from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../utils/colors";
import { useCart } from "../context/CartContext";
import { useLocation } from './LocationContext';
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const SearchScreen = ({ navigation }) => {
  const firestore = getFirestore();
  const { locationId } = useLocation();
  const { cart, addToCart, removeFromCart, cartItems } = useCart();

  const [foodData, setFoodData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!locationId) return;

    const foodDataRef = collection(firestore, locationId);

    const unsubscribe = onSnapshot(foodDataRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = `${data.FoodName?.toLowerCase().trim()}_${data.FoodPrice}`;
        return {
          id,
          FoodName: data.FoodName,
          FoodPrice: data.FoodPrice,
          FoodImageUrl: data.FoodImageUrl,
          InStock: data.InStock,
          Pop: data.Pop,
        };
      });
      setFoodData(items);
    });

    return () => unsubscribe();
  }, [locationId]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const incrementQuantity = (item) => addToCart(item);
  const decrementQuantity = (item) => removeFromCart(item);

  const renderMenuItem = ({ item }) => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const inStock = item.InStock === true || item.InStock === 'true' || item.InStock === 1;

    return (
      <View style={styles.menuItem}>
        <Image source={{ uri: item.FoodImageUrl }} style={styles.menuItemImage} />
        <Text style={styles.menuItemTitle}>{item.FoodName}</Text>
        <Text style={styles.itemPrice}>₹{item.FoodPrice}</Text>

        {inStock ? (
          quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <Button mode="outlined" onPress={() => decrementQuantity(item)}>
                <Ionicons name="remove" size={16} color="black" />
              </Button>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button mode="outlined" onPress={() => incrementQuantity(item)}>
                <Ionicons name="add" size={16} color="black" />
              </Button>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => incrementQuantity(item)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity style={styles.outOfStockButton} disabled>
            <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const translateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={foodData.filter(item =>
          item.FoodName.replace(/\s+/g, '').toLowerCase().includes(searchQuery.replace(/\s+/g, '').toLowerCase())
        )}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      />
      <Animated.View style={[styles.bottomBar, { transform: [{ translateY }] }]}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MainScreen")}>
          <Icon name="home-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Search")}>
          <Icon name="search-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart", { cartItems })}>
          <Icon name="cart-outline" size={27} color={colors.black} />
          {cartItems?.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
          <Icon name="person-circle-outline" size={27} color={colors.black} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};








const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    borderColor: colors.gray2,
  },
  cartIcon: {
    paddingRight: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.pure,
    paddingLeft: 16,
    marginBottom: 10,
  },
  flatList: {
    paddingLeft: 16,
  },
  categoryItem: {
    marginRight: 16,
    alignItems: "center",
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  outOfStockButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  outOfStockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  topPickItem: {
    marginRight: 16,
    alignItems: "center",
  },
  topPickImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  topPickTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: colors.pure,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  popularDishItem: {
    marginRight: 16,
    alignItems: "center",
  },
  popularDishImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  popularDishTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },

  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: colors.pure,
    borderRadius: 15,
    padding: 5,
  },
  quantityButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 18,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.gray2,
  },
  menuItemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuItemList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});


export default SearchScreen;
