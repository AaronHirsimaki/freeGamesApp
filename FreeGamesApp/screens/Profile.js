import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { logout } from '../auth/authService';
import { FirebaseAuth } from '../firebaseConfig'; // Oletetaan, että auth on jo konfiguroitu Firebaseen

export default function Profile({ navigation }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Hae kirjautuneen käyttäjän sähköposti
    const currentUser = FirebaseAuth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

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
      <Text style={styles.email}>{userEmail}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#6a0dad', // Purple background
    paddingVertical: 12, // Vertical padding

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
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 30,
  },
});
