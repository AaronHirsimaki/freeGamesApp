
import { FlatList, StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

const Home = () => {

    const [games, setGames] = useState([]);
    const [isLoading, setIsLoding] = useState(true);
    const [error, setError] = useState(null);

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
                console.log(data);
            }).catch((error) => {
                setError(error.message);
                console.log(error.message);
                setIsLoding(false);
            })
    }
    return (
        <View>
            {isLoading ? (
                <ActivityIndicator  color="blue" size="large" />
            ) : error ? (
            <Text> { error } </Text>
            ) : (
                <FlatList 
                showsVerticalScrollIndicator={false}
                data={games}
                renderItem={({ item }) => (
                    <View>
                        <Image source={{uri: item.thumbnail}} style={styles.image} />
                        <Text style={styles.text}>{item.short_description}</Text>
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
    }
});