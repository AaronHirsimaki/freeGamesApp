
import { FlatList, Button, StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FirebaseApp, FirebaseFirestore } from '../firebaseConfig'; // Firestore import
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getDatabase, ref, set, get, remove, push } from "firebase/database";
import * as Font from 'expo-font';

import { FirebaseAuth } from "../firebaseConfig";

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


// Poistaa pelin toivelistalta
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

const Home = () => {

    const [games, setGames] = useState([]);
    const [isLoading, setIsLoding] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const userId = FirebaseAuth.currentUser?.uid; // Käytetään FirebaseAuthin currentUser-objektia

    const addGameToWishlist = async (game) => {
        const userId = FirebaseAuth.currentUser?.uid;  // Get the current user ID
        if (!userId) {
            console.error("User is not logged in");
            return;
        }

        const db = getDatabase(FirebaseApp);
        const gameRef = ref(db, `wishlist/${userId}/${game.id}`);
        console.log(gameRef);

        console.log(game)

        try {
            await set(gameRef, {
                name: game.title,
                img: game.thumbnail
            });
            console.log('Game added to wishlist');
            loadWishlist(userId);  // Varmista, että käyttäjän ID on mukana
        } catch (error) {
            console.error('Error adding game to wishlist:', error);
        }
    };

    // Funktio toivelistan hakemiseksi
    const loadWishlist = async () => {
        console.log("UserId:", userId);
        if (userId) {
            console.log("yay")
            const wishlistData = await fetchWishlist(userId);
            setWishlist(wishlistData);
        }
    };

    useEffect (() => {
        loadWishlist()
    },[])

    /* const handleAddToWishlist = async (game) => {
        try {
            const userId = FirebaseAuth.currentUser?.uid;  // Get the current user ID
            if (!userId) throw new Error("User is not logged in");

            const db = getDatabase(FirebaseApp);  // Initialize the Realtime Database
            const wishlistRef = ref(db, 'wishlists/' + userId);  // Reference to the user's wishlist

            // Use push to add a new game to the user's wishlist
            const newGameRef = push(wishlistRef);
            console.log(newGameRef)
            await set(newGameRef, {
                gameId: game.id,
                gameName: game.title,
                addedAt: Date.now(),
            });

            console.log("Game added to wishlist successfully");
        } catch (error) {
            console.error('Error adding game to wishlist:', error);
        }
    }; */


    // Poistaa pelin toivelistalta
    const handleRemoveFromWishlist = (gameId) => {
        removeGameFromWishlist(userId, gameId);
        loadWishlist(); // Päivittää toivelistan
    };

    useEffect(() => {
        getGames();
    }, []);

    const getGames = () => {
        const URL = "https://www.freetogame.com/api/games";

        fetch(URL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Something went wrong");
                }
                return res.json();
            })
            .then((data) => {
                setGames(data);
                setIsLoding(false);
            }).catch((error) => {
                setError(error.message);
                console.log(error.message);
                setIsLoding(false);
            })
    }
    return (
        <View>
            <Text style={styles.title}>FreeGamesList</Text>
            {isLoading ? (
                <ActivityIndicator color="blue" size="large" />
            ) : error ? (
                <Text> {error} </Text>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={games}
                    renderItem={({ item }) => (
                        <View>
                            <Image source={{ uri: item.thumbnail }} style={styles.image} />
                            <Text style={styles.text}>{item.short_description}</Text>
                            <Button title="Add to Wishlist" style={styles.button} onPress={() => addGameToWishlist(item)}/>
                        </View>
                    )} />
            )}
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 400,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        paddingTop: 5,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        fontSize: 30,
        paddingTop: 65,
        paddingBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    button: {
        color: 'red'
    }
});