import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from './firebaseConfig';
import firebaseConfig from './firebaseConfig';
import firebase from './firebaseSetup';


import Home from './screens/Home';
import Wishlist from './screens/Wishlist';
import Profile from './screens/Profile';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Games') {
            iconName = 'game-controller-outline';
          } else if (route.name === 'Wishlist') {
            iconName = 'reader-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Wishlist" component={Wishlist} options={{ headerShown: false }}/>
      <Tab.Screen name="Games" component={Home} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
    </Tab.Navigator>
  )
}

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = FirebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state when authentication state changes
    });

    return unsubscribe; // Cleanup the listener on component unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});