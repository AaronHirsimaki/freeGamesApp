import { FlatList, Button, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { FirebaseApp } from '../firebaseConfig';
import { getDatabase, ref, set, get, remove, push } from "firebase/database";

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
    const userId = FirebaseAuth.currentUser?.uid; 

    const addGameToWishlist = async (game) => {
        const userId = FirebaseAuth.currentUser?.uid;  
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
                img: game.thumbnail,
                link: game.game_url
            });
            console.log('Game added to wishlist');
            loadWishlist(userId); 
        } catch (error) {
            console.error('Error adding game to wishlist:', error);
        }
    };

   
    const loadWishlist = async () => {
        console.log("UserId:", userId);
        if (userId) {
            console.log("yay")
            const wishlistData = await fetchWishlist(userId);
            setWishlist(wishlistData);
        }
    };

    useEffect(() => {
        loadWishlist()
    }, [])

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
                            <Text style={styles.gamename}>{item.title}</Text>
                            <Text style={styles.description}>{item.short_description}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.game_url)}>
                                <Text style={styles.buttonText}>Visit site</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => addGameToWishlist(item)}>
                                <Text style={styles.buttonText}>Add to Wishlist</Text>
                            </TouchableOpacity>
                        </View>
                    )} />
            )}
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    image: {
        paddingTop: 15,
        height: 200,
        width: 380,
        resizeMode: 'cover',
        marginHorizontal: 10,
        paddingTop: 25
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        paddingTop: 5,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        fontSize: 30,
        paddingTop: 65,
        paddingBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#6a0dad', 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 30, 
        width: '100%', 
        justifyContent: 'center', 
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        marginVertical: 3
    },
    buttonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center', 
    },
    container: {
        flex: 1,
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    gamename: {
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        textAlign: 'center', 
        marginVertical: 10,

    },
    description: {
        fontSize: 16, 
        color: '#666', 
        lineHeight: 22, 
        textAlign: 'left', 
        marginBottom: 15, 
        paddingHorizontal: 10,
        textAlign: 'center' 
      },

});