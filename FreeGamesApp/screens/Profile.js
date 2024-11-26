import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { logout } from '../auth/authService';

export default function Profile({ navigation }) {

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
      <Text>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
