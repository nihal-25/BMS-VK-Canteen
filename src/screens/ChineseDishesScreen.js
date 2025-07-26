import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity,StyleSheet } from 'react-native';
import { Searchbar, Button, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { colors } from '../utils/colors';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useLocation } from './LocationContext';

const ChineseDishesScreen = ({ navigation }) => {
  const firestore = getFirestore();
  const { locationId } = useLocation();
  const [breakfastData, setBreakfastData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    if (!locationId) return;

    const foodCollection = collection(firestore, locationId);
    const breakfastQuery = query(foodCollection, where("Category", "==", "Chinese"));

    const unsubscribe = onSnapshot(breakfastQuery, (snapshot) => {
      const foodItems = snapshot.docs.map(doc => {
        const data = doc.data();
        const nameKey = data.FoodName?.trim().toLowerCase();
        const price = data.FoodPrice;

        return {
          id: nameKey + '_' + price,
          FoodName: data.FoodName,
          FoodPrice: price,
          FoodImageUrl: data.FoodImageUrl,
          InStock: data.InStock,
        };
      });
      setBreakfastData(foodItems);
    }, (error) => {
      console.error("Error fetching real-time data:", error);
    });

    return () => unsubscribe();
  }, [locationId]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const incrementQuantity = (item) => {
    addToCart(item);
  };

  const decrementQuantity = (item) => {
    removeFromCart(item);
  };

  const renderItem = ({ item }) => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.FoodImageUrl }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.FoodName}</Text>
        <Text style={styles.itemPrice}>₹{item.FoodPrice}</Text>
        {(item.InStock === true || item.InStock === 'true' || item.InStock === 1) ? (
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => incrementQuantity(item)}
            >
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

  const totalItemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chinese" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="cart" onPress={navigateToCart} />
        {totalItemsInCart > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItemsInCart}</Text>
          </View>
        )}
      </Appbar.Header>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={breakfastData.filter((item) =>
          item.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appbarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.pure,
  },
  searchBar: {
    margin: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    elevation: 2,
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
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.pure,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 35,
    top: 0,
    zIndex: 1,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChineseDishesScreen;


// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
// import { Searchbar, Button, Appbar } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useCart } from '../context/CartContext'; 
// import { colors } from '../utils/colors';

// const chineseDishesData = [
//   {
//     id: 'c1',
//     name: 'Paneer Chilli',
//     image: require('../assets/pan_chill.jpg'),
//     price: 70,
//   },
//   {
//     id: 'c2',
//     name: 'Gobi Chilli',
//     image: require('../assets/gob_chill.jpg'),
//     price: 70,
//   },
//   {
//     id: 'c3',
//     name: 'Paneer Fried Rice',
//     image: require('../assets/pan_rice.jpg'),
//     price: 65,
//   },
//   {
//     id: 'c4',
//     name: 'Gobi Rice',
//     image: require('../assets/gob_rice.jpg'),
//     price: 60,
//   },
//   {
//     id: 'c5',
//     name: 'Egg Fried Rice',
//     image: require('../assets/dish1.jpg'),
//     price: 70,
//   },
//   {
//     id: 'c6',
//     name: 'Egg Noodles',
//     image: require('../assets/egg_noo.jpg'),
//     price: 70,
//   },
// ];

// const ChineseDishesScreen = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const { cart, addToCart, removeFromCart } = useCart();

//   const onChangeSearch = (query) => setSearchQuery(query);

//   const incrementQuantity = (item) => {
//     const existingItem = cart.find((cartItem) => cartItem.id === item.id);
//     if (existingItem) {
//       addToCart({ ...existingItem, quantity: existingItem.quantity + 1 });
//     } else {
//       addToCart({ ...item, quantity: 1 });
//     }
//   };

//   const decrementQuantity = (item) => {
//     const existingItem = cart.find((cartItem) => cartItem.id === item.id);
//     if (existingItem && existingItem.quantity > 1) {
//       removeFromCart({ ...existingItem, quantity: existingItem.quantity - 1 });
//     } else {
//       removeFromCart(item);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const cartItem = cart.find((cartItem) => cartItem.id === item.id);
//     const quantity = cartItem ? cartItem.quantity : 0;

//     return (
//       <View style={styles.itemContainer}>
//         <Image source={item.image} style={styles.itemImage} />
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
//         {quantity > 0 ? (
//           <View style={styles.quantityContainer}>
//             <Button mode="outlined" onPress={() => decrementQuantity(item)}>
//               <Ionicons name="remove" size={16} color="black" />
//             </Button>
//             <Text style={styles.quantityText}>{quantity}</Text>
//             <Button mode="outlined" onPress={() => incrementQuantity(item)}>
//               <Ionicons name="add" size={16} color="black" />
//             </Button>
//           </View>
//         ) : (
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => incrementQuantity(item)}
//           >
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const totalItemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);

//   const navigateToCart = () => {
//     navigation.navigate('Cart'); 
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Appbar.Header>
//         <Appbar.BackAction onPress={() => navigation.goBack()} />
//         <Appbar.Content title="Chinese Dishes" titleStyle={styles.appbarTitle}/>
//         <Appbar.Action icon="cart" onPress={navigateToCart} />
//         {totalItemsInCart > 0 && (
//           <View style={styles.cartBadge}>
//             <Text style={styles.cartBadgeText}>{totalItemsInCart}</Text>
//           </View>
//         )}
//       </Appbar.Header>
//       <Searchbar
//         placeholder="Search"
//         onChangeText={onChangeSearch}
//         value={searchQuery}
//         style={styles.searchBar}
//       />
//       <FlatList
//         data={chineseDishesData.filter((dish) =>
//           dish.name.toLowerCase().includes(searchQuery.toLowerCase())
//         )}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContainer}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   appbarTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.pure, 
//   },
//   searchBar: {
//     margin: 10,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//     marginHorizontal: 10,
//     padding: 10,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 8,
//     elevation: 2,
//   },
//   itemImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   itemName: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   itemPrice: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityText: {
//     marginHorizontal: 10,
//     fontSize: 16,
//   },
//   addButton: {
//     backgroundColor: colors.pure,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cartBadge: {
//     position: 'absolute',
//     backgroundColor: 'red',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     right: 40,
//     top: 0,
//     zIndex: 1,
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });

// export default ChineseDishesScreen;
