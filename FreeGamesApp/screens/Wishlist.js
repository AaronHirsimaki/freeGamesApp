import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
    const db = getDatabase(FirebaseApp);  // Initialize Realtime Database
    const gameRef = ref(db, `wishlist/${userId}/${gameId}`);  // Reference to the specific game
    await remove(gameRef);  // Remove the game from wishlist
    console.log('Game removed from wishlist');
  } catch (error) {
    console.error('Error removing game from wishlist:', error);
  }
};

export default function Wishlist({ navigation }) {

  const [games, setGames] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = FirebaseAuth.currentUser?.uid;


  // Funktio pelien hakemiseksi Firestoresta
  const loadGames = async () => {
    setGames([

    ]);
  };

  /* const loadWishlist = async () => {
    console.log("UserId:", userId);
    if (userId) {
        console.log("yay")
        const wishlistData = await fetchWishlist(userId);
        setWishlist(wishlistData);
    }
}; */

  /* useEffect (() => {
      loadWishlist()
  },[]) */

  useEffect(() => {
    if (!userId) return;

    const db = getDatabase();
    const wishlistRef = ref(db, `wishlist/${userId}`);

    // Subscribe to real-time updates
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      if (snapshot.exists()) {
        const wishlistData = snapshot.val();
        const formattedWishlist = Object.entries(wishlistData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setWishlist(formattedWishlist);
      } else {
        setWishlist([]); // Clear wishlist if no data exists
      }
    });

    // Cleanup the listener on component unmount
    return () => off(wishlistRef);
  }, [userId]); // Re-run if userId changes

  useEffect(() => {
    loadGames();
  }, []);


  // Lisää peli toivelistalle
  const handleAddToWishlist = (game) => {
    addGameToWishlist(userId, game);
    //loadWishlist(); // Päivittää toivelistan
  };

  // Poistaa pelin toivelistalta
  const handleRemoveFromWishlist = (gameId) => {
    removeGameFromWishlist(userId, gameId);
    //loadWishlist(); // Päivittää toivelistan
  };

  /*  useEffect(() => {
     loadGames();
     loadWishlist();
   }, []); */

  const handleLogout = async () => {
    try {
      await logout();  // Kirjaa ulos käyttäjä
      navigation.navigate('Login');  // Siirry takaisin kirjautumissivulle
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
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
            {/* <Button title="Remove from Wishlist" onPress={() => handleRemoveFromWishlist(item.id)} /> */}
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.game_url)}>
              <Text style={styles.buttonText}>Visit site</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleRemoveFromWishlist(item.id)}>
              <Text style={styles.buttonText}>Remove from Wishlist</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* <Button title="Logout" onPress={handleLogout} /> */}
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
    //justifyContent: 'space-between',
    width: '100%', // Täyttää näytön leveyden
    padding: 16, // Lisää sisäistä marginaalia
    marginBottom: 12, // Väliä kohteiden väliin
    backgroundColor: '#f9f9f9', // Halutessasi kevyt taustaväri
    borderRadius: 10, // Pyöristetyt reunat
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: '100%',
    paddingBottom: 10,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#6a0dad', // Purple background
    paddingVertical: 12, // Vertical padding
    marginVertical: 5,
    borderRadius: 30, // Rounded corners
    width: '100%',
    justifyContent: 'center', // Center the text vertically
    elevation: 5, // Adds a shadow (Android)
    shadowColor: '#000', // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.2, // Shadow opacity (iOS)
    shadowRadius: 5, // Shadow radius (iOS)
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center the text
  },
  gameItem: {
    width: '100%', // Täyttää koko näytön leveyden
    padding: 16, // Lisää sisäistä marginaalia
    marginBottom: 12, // Lisää väliä kohteiden väliin // Kevyt taustaväri erotteluun
    borderRadius: 10, // Pyöristetyt reunat
    alignItems: 'center', // Keskittää sisällön
  },

});

