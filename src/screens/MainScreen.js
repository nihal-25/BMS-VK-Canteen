import React, { useState, useEffect, useRef,useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Searchbar, Button, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../utils/colors";
import Icon from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext";
import { doc, getDocs, getFirestore, collection, onSnapshot, collectionGroup, query, where } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';
import { useLocation } from './LocationContext';
import { firestore } from '../config/firebaseConfig';
import { getAuth } from 'firebase/auth';

const categories = [
  {
    id: "1",
    title: "Breakfast",
    image: require("../assets/breakfast.jpg"),
    description: "South Indian breakfast",
  },
  {
    id: "2",
    title: "Chinese",
    image: require("../assets/chinese.jpg"),
    description: "Chinese dishes",
  },
  {
    id: "3",
    title: "Beverages",
    image: require("../assets/beverages.jpg"),
    description: "Fresh drinks",
  },
  {
    id: "4",
    title: "Short Eats",
    image: require("../assets/snacks.jpg"),
    description: "Snacks",
  },
];

const MainScreen = ({route, navigation }) => {
  const firestore = getFirestore();
  const { locationId } = useLocation() ;
  useEffect(() => {
   if (locationId) {
     console.log('Selected Location:', locationId);
     // Use this to route orders, show location-specific items, etc.
   }
 }, [locationId]);
  const [foodData, setFoodData] = useState([]);
  const foodDataQry = collection(firestore, locationId);
  const { cart, addToCart, removeFromCart } = useCart();

 const [searchQuery, setSearchQuery] = useState('');
 
//  useEffect(() => {
//    const unsubscribe = onSnapshot(foodDataQry, (snapshot) => {
//      setFoodData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//    });

//    return () => unsubscribe(); // Unsubscribe when the component unmounts

//  }, []);  

 // THIS ABOVE WAS BEFORE CODE I CHANGED WHEN I ADDED FOOD COLLECTION IN FOODDATA COLLECTION

 useEffect(() => {
  const fetchFoodData = async () => {
    const foodDataQry = collection(firestore, locationId);

    // Get the snapshot of FoodData collection
    const unsubscribe = onSnapshot(foodDataQry, async (snapshot) => {
      const data = [];

      // Loop over each document in FoodData collection
      for (const docSnapshot of snapshot.docs) {
        const foodItems = [];
        const foodCollectionRef = collection(docSnapshot.ref, "food");

        // Fetch all documents in the 'food' subcollection for each FoodData document
        const foodSnapshot = await getDocs(foodCollectionRef);
        foodSnapshot.forEach((foodDoc) => {
          foodItems.push({
            id: foodDoc.data().FoodName,
            FoodName: foodDoc.data().FoodName,
            FoodPrice: foodDoc.data().FoodPrice,
            FoodImageUrl: foodDoc.data().FoodImageUrl, // If there's an image field
            InStock: foodDoc.data().InStock,
            Pop:foodDoc.data().Pop,
          });
        });

        // Push the food items to the data array
        data.push(...foodItems);
      }

      setFoodData(data);
    });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  };

  fetchFoodData();
}, []);

const onChangeSearch = (query) => setSearchQuery(query);
const incrementQuantity = (item) => {
  addToCart(item);
};



const decrementQuantity = (item) => {
  removeFromCart(item);
};

const [topPicks, setTopPicks] = useState([]);

const fetchTopOrderedItems = async () => {
  const user = getAuth().currentUser;
  if (!user || !locationId) return;

  const userRef = doc(firestore, 'userOrders', user.uid);
  const pastOrdersSnap = await getDocs(collection(userRef, 'pastOrders'));

  const orderMap = new Map();

  pastOrdersSnap.forEach(doc => {
    const order = doc.data();
    
    if (order.location !== locationId) return; // ✅ Filter by location

    order.cart?.forEach(item => {
      const key = item.FoodName?.trim().toLowerCase();
      if (!key) return;

      const current = orderMap.get(key) || { ...item, quantity: 0 };
      current.quantity += item.quantity || 0;
      orderMap.set(key, current);
    });
  });

  const sorted = Array.from(orderMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  setTopPicks(sorted);
};

useEffect(() => {
  fetchTopOrderedItems();
}, [locationId]);

 

  const [location, setLocation] = useState("");
  const { cartItems,  } = useCart();
  const [quantities, setQuantities] = useState({});
  const scrollY = useRef(new Animated.Value(0)).current;

  const {  updateCartItem } = useCart();

  

  const handleAddToCart = (item) => {
    addToCart(item);
    ToastAndroid.showWithGravityAndOffset(
      `${item.foodName} added to cart`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      150
    );
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.FoodName]: (prevQuantities[item.FoodName] || 0) + 1,
    }));
  };

  const handleIncrease = (item) => {
    addToCart(item);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.FoodName]: (prevQuantities[item.FoodName] || 0) + 1,
    }));
  };

  const handleDecrease = (item) => {
    removeFromCart(item);
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (newQuantities[item.FoodName] > 1) {
        newQuantities[item.FoodName] -= 1;
      } else {
        delete newQuantities[item.FoodName];
      }
      return newQuantities;
    });
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        if (item.title === "Breakfast") {
          navigation.navigate("BreakfastList", { addToCart });
        } else if (item.title === "Beverages") {
          navigation.navigate("DrinksList", { addToCart });
        } else if (item.title === "Chinese") {
          navigation.navigate("ChineseDishes", { addToCart });
        } else if (item.title === "Short Eats") {
          navigation.navigate("ShortEats", { addToCart });
        }
      }}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <Text style={styles.categoryDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderTopPickItem = ({ item }) => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    if (!item) return null; 
      return (
        <View style={styles.topPickItem}>
          <Image source={{ uri: item.FoodImageUrl }} style={styles.topPickImage} />
          <Text style={styles.topPickTitle}>{item.FoodName}</Text>
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
                  ): (
              <TouchableOpacity style={styles.outOfStockButton} disabled>
                <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
              </TouchableOpacity>
            )}
        </View>
      );
     
    
  };

  const [popularDishes, setPopularDishes] = useState([]);
  
  const fetchPopularDishes = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'confirmedOrders'));

    const dishMap = new Map();

    snapshot.forEach(doc => {
      const order = doc.data();
      if (order.location !== locationId) return; // filter by location

      order.cart?.forEach(item => {
        const key = item.FoodName?.trim().toLowerCase();
        if (!key) return;

        const current = dishMap.get(key) || { ...item, quantity: 0 };
        current.quantity += item.quantity || 0;
        dishMap.set(key, current);
      });
    });

    const sorted = Array.from(dishMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setPopularDishes(sorted);
  } catch (err) {
    console.error('Error fetching popular dishes:', err);
  }
};

useEffect(() => {
  fetchPopularDishes();
}, [locationId]);
  

  const renderPopularDishItem = ({ item }) => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    if (!item) return null; 
      return (
        <View style={styles.topPickItem}>
          <Image source={{ uri: item.FoodImageUrl }} style={styles.topPickImage} />
          <Text style={styles.topPickTitle}>{item.FoodName}</Text>
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
                  ): (
              <TouchableOpacity style={styles.outOfStockButton} disabled>
                <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
              </TouchableOpacity>
            )}
        </View>
      );
     
    
  };

  
 
  const renderMenuItem = ({ item }) => {
    
      const cartItem = cart.find((cartItem) => cartItem.id === item.id);
      const quantity = cartItem ? cartItem.quantity : 0;
      return(
    <View style={styles.menuItem}>
        <Image source={{ uri: item.FoodImageUrl }} style={styles.menuItemImage} />
        <Text style={styles.menuItemTitle}>{item.FoodName}</Text>
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
        ): (
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
   
      <FlatList
        data={foodData}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.FoodName}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
        ListHeaderComponent={
          <>
           <View style={styles.header}>
  <Text style={styles.locationText}>Your Location:</Text>
  <TouchableOpacity
    style={styles.locationButton}
    onPress={() => navigation.navigate("LocationSelect")}
  >
    <Text style={styles.locationButtonText}>
      {locationId || "Select Location"}
    </Text>
  </TouchableOpacity>
</View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shop by categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatList}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top picks for you</Text>
              <FlatList
                data={topPicks}
                renderItem={renderTopPickItem}
                keyExtractor={(item) => item.id || item.FoodName}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatList}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Dishes</Text>
              <FlatList
                data={popularDishes}
                renderItem={renderPopularDishItem}
                keyExtractor={(item) => item.FoodName}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatList}
              />
            </View>
           
          </>
        }
      />
      

      <Animated.View
        style={[
          styles.bottomBar,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MainScreen")}
        >
          <Icon name="home-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Search")}
        >
          <Icon name="search-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Cart", { cartItems })}
        >
          <Icon name="cart-outline" size={27} color={colors.black} />
          {cartItems?.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
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
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#fff',
},
locationText: {
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 8,
},
locationButton: {
  backgroundColor: 'red',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},
locationButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 16,
  },
});

export default MainScreen;
