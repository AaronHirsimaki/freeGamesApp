import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { login } from '../auth/authService';
import { useNavigation } from '@react-navigation/native';


export const saveUserToFirestore = async (user) => {
  try {
    if (!user) {
      console.error("No user provided");
      return;
    }

    const userRef = doc(FirebaseFirestore, "users", user.uid); 

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Anonymous",
      createdAt: new Date(),
    });

    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
  }
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    
    if (!email || !password) {
      setError('Email and password cannot be empty');
      return;
    }

    try {
      console.log('Attempting login with', email, password);  
      await login(email, password);
      console.log('Login successful');
      navigation.navigate('Home');  
    } catch (error) {
      console.log('Login error:', error.message);  
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 16 
  },
  input: { 
    borderBottomWidth: 1,
    marginBottom: 12, 
    padding: 8 
  },
  error: { 
    color: 'red', 
    marginBottom: 12 
  },
  button: {
    backgroundColor: '#6a0dad', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
  },
  buttonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  }
});
