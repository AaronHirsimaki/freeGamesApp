import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { login } from '../auth/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Attempting login with', email, password);  // Debug-loki
      await login(email, password);
      console.log('Login successful');
      // Voit ohjata käyttäjän eteenpäin onnistuneen kirjautumisen jälkeen
      navigation.navigate('Home');  // Esimerkiksi, jos haluat siirtyä Home-näkymään
    } catch (error) {
      console.log('Login error:', error.message);  // Debug-loki virheen varalta
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 12, padding: 8 },
  error: { color: 'red', marginBottom: 12 }
});
