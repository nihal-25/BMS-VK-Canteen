import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { colors } from '../utils/colors';



const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // ✅ get navigation object

  const fetchOrders = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const userRef = doc(firestore, 'userOrders', user.uid);

      const [currentSnap, pastSnap] = await Promise.all([
        getDocs(collection(userRef, 'currentOrders')),
        getDocs(collection(userRef, 'pastOrders')),
      ]);

      const currentOrders = currentSnap.docs.map(doc => ({
        id: doc.id,
        status: 'In Progress',
        ...doc.data(),
      }));

      const pastOrders = pastSnap.docs.map(doc => ({
        id: doc.id,
        status: 'Completed',
        ...doc.data(),
      }));

      const allOrders = [...pastOrders].sort(
        (a, b) => new Date(b.timestamp?.toDate?.()) - new Date(a.timestamp?.toDate?.())
      );

      setOrders(allOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.status}>{item.status}</Text>
      <Text style={styles.info}>Location: {item.location === "FoodData"
        ? "Law Canteen"
        : item.location === "FoodData2"
        ? "Sports Canteen"
        : "Select Location"}</Text>
      <Text style={styles.info}>Date: {item.timestamp?.toDate().toLocaleString()}</Text>
      <Text style={styles.info}>Total: ₹{parseFloat(item.total)}</Text>

      {item.cart?.length > 0 && (
        <>
          <Text style={styles.subheading}>Items:</Text>
          {item.cart.map((food, idx) => (
            <View key={idx} style={styles.foodItem}>
              
              <View>
                <Text>{food.FoodName} x{food.quantity}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Ionicons name="arrow-back" size={24} color="gray" />
                    </TouchableOpacity>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
                <Text style={styles.emptyText}>No Orders Currently. Order Now!</Text>
        }
      />
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
  },
 backButton: {
  paddingHorizontal: 16,
  paddingTop: 40, 
  paddingBottom: 8,
},
emptyText: {
  textAlign: 'center',
  marginTop: 50,
  fontSize: 16,
  color: 'red',
},

  orderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fdfdfd',
  },
  status: {
    fontWeight: 'bold',
    color: colors.pure,
    fontSize: 16,
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  subheading: {
    marginTop: 6,
    fontWeight: '600',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  foodImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 6,
  },
});
