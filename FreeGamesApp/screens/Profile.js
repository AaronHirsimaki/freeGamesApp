import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { logout } from '../auth/authService';
import { FirebaseAuth } from '../firebaseConfig';

export default function Profile({ navigation }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
   
    const currentUser = FirebaseAuth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();  
      navigation.navigate('Login');  
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
    backgroundColor: '#6a0dad', 
    paddingVertical: 12, 

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
