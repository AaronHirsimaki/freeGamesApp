import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { logout } from '../auth/authService';
import { FirebaseApp, FirebaseFirestore } from '../firebaseConfig'; // Firestore import
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getDatabase, ref, set, get, remove, onValue } from "firebase/database";
import * as Font from 'expo-font';
import { FirebaseAuth } from '../firebaseConfig';
import { FirebaseDatabase } from '../firebaseConfig';


const fetchWishlist = async (userId) => {
  try {
    const db = getDatabase(FirebaseApp);
    const wishlistRef = ref(db, `wishlist/${userId}`);
    console.log(wishlistRef)
    const snapshot = await get(wishlistRef);
    console.log(snapshot);
    if (snapshot.exists()) {
      const wishlistData = snapshot.val();
      console.log("Wishlist data:", wishlistData);
      return Object.entries(wishlistData).map(([gameId, gameData]) => ({
        id: gameId,
        ...gameData,
      }));
    } else {
      console.log("No wishlist data available");
      return [];
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};


const removeGameFromWishlist = async (userId, gameId) => {
  try {
    const db = getDatabase(FirebaseApp);  
    const gameRef = ref(db, `wishlist/${userId}/${gameId}`);  
    await remove(gameRef);  
    console.log('Game removed from wishlist');
  } catch (error) {
    console.error('Error removing game from wishlist:', error);
  }
};

export default function Wishlist({ navigation }) {

  const [games, setGames] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = FirebaseAuth.currentUser?.uid;


  
  const loadGames = async () => {
    setGames([

    ]);
  };

  useEffect(() => {
    if (!userId) return;

    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}`);

    
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      if (snapshot.exists()) {
        const wishlistData = snapshot.val();
        const formattedWishlist = Object.entries(wishlistData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setWishlist(formattedWishlist);
      } else {
        setWishlist([]); 
      }
    });

    return () => off(wishlistRef);
  }, [userId]); 

  useEffect(() => {
    loadGames();
  }, []);
  
  const handleRemoveFromWishlist = (gameId) => {
    removeGameFromWishlist(userId, gameId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wishlist</Text>
      <FlatList
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, width: '100%' }}
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.link)}>
              <Text style={styles.buttonText}>Visit site</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleRemoveFromWishlist(item.id)}>
              <Text style={styles.buttonText}>Remove from Wishlist</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  title: {
    fontSize: 30,
    paddingTop: 65,
    paddingBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  gameItem: {
    width: '100%', 
    padding: 16,
    marginBottom: 12, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 10, 
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: '100%',
    paddingBottom: 10,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#6a0dad', 
    paddingVertical: 12, 
    marginVertical: 5,
    borderRadius: 30, 
    width: '100%',
    justifyContent: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
  gameItem: {
    width: '100%', 
    padding: 16,
    marginBottom: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
  },

});

