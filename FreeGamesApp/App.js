import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [games, setGames] = useState([]);

  const getFreegames = () => {
    fetch('https://www.freetogame.com/api/games', {
      headers: {
        'Authorization': '<your-api-key>'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // do something with the data
    })
    .catch(error => console.log(error));
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>FreeGamesList</Text>
        data={getFreegames}
      </View>

      <View>
        <Text>Games</Text>
      </View>

      <View>
        <Text>Other</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

