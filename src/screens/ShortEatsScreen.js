import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Searchbar, Button, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { colors } from '../utils/colors';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useLocation } from './LocationContext';

const ShortEatsScreen = ({ navigation }) => {
  const firestore = getFirestore();
  const { locationId } = useLocation() ;
  const [breakfastData, setBreakfastData] = useState([]); // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, removeFromCart } = useCart();

  // Fetch data from Firestore
  useEffect(() => {
    const fetchBreakfastData = async () => {
      try {
        const foodCollection = collection(firestore, locationId, "4new", "food"); // Reference to the 'food' collection inside '1new' document
        const foodSnapshot = await getDocs(foodCollection);
        const foodItems = foodSnapshot.docs.map(doc => ({
          id: doc.data().FoodName,
            FoodName: doc.data().FoodName,
            FoodPrice: doc.data().FoodPrice,
            FoodImageUrl: doc.data().FoodImageUrl,
            InStock: doc.data().InStock,
        }));
        setBreakfastData(foodItems); // Set the fetched data
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchBreakfastData();
  }, []);

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
        ):(
          <TouchableOpacity style={styles.outOfStockButton} disabled>
      <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
    </TouchableOpacity>
        )}
      </View>
    );
  };

  // Calculate total items in cart
  const totalItemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Function to navigate to cart screen
  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Short Eats" titleStyle={styles.appbarTitle} />
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

export default ShortEatsScreen;


// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
// import { Searchbar, Button, Appbar } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useCart } from '../context/CartContext'; 
// import { colors } from '../utils/colors';

// const shortEatsData = [
//   {
//     id: 's1',
//     name: 'Masala Kurkure',
//     image: require('../assets/kur1.jpg'),
//     price: 20,
//   },
//   {
//     id: 's2',
//     name: 'Green Lays',
//     image: require('../assets/lays1.jpg'),
//     price: 20,
//   },
//   {
//     id: 's3',
//     name: 'Blue Lays',
//     image: require('../assets/lays2.jpg'),
//     price: 20,
//   },
//   {
//     id: 's4',
//     name: 'Orange Lays',
//     image: require('../assets/lays3.jpg'),
//     price: 20,
//   },
//   {
//     id: 's5',
//     name: 'Nachos',
//     image: require('../assets/nacho.jpg'),
//     price: 35,
//   },
//   {
//     id: 's6',
//     name: 'Rajasthani',
//     image: require('../assets/kur2.jpg'),
//     price: 20,
//   },
// ];

// const ShortEatsScreen = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const { cart, addToCart, removeFromCart } = useCart();

//   // Function to handle search query change
//   const onChangeSearch = (query) => setSearchQuery(query);

//   // Function to increment item quantity in cart
//   const incrementQuantity = (item) => {
//     const existingItem = cart.find((cartItem) => cartItem.id === item.id);
//     if (existingItem) {
//       addToCart({ ...existingItem, quantity: existingItem.quantity + 1 });
//     } else {
//       addToCart({ ...item, quantity: 1 });
//     }
//   };

//   // Function to decrement item quantity in cart
//   const decrementQuantity = (item) => {
//     const existingItem = cart.find((cartItem) => cartItem.id === item.id);
//     if (existingItem && existingItem.quantity > 1) {
//       removeFromCart({ ...existingItem, quantity: existingItem.quantity - 1 });
//     } else {
//       removeFromCart(item);
//     }
//   };

//   // Function to render each item in the flatlist
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

//   // Calculate total items in cart
//   const totalItemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);

//   // Function to navigate to cart screen
//   const navigateToCart = () => {
//     navigation.navigate('Cart'); 
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Appbar.Header>
//         <Appbar.BackAction onPress={() => navigation.goBack()} />
//         <Appbar.Content title="Short Eats" titleStyle={styles.appbarTitle}/>
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
//         data={shortEatsData.filter((item) =>
//           item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

// export default ShortEatsScreen;
