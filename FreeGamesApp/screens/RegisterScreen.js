import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { register } from '../auth/authService';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      
    } catch (error) {
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
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Back</Text>
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
