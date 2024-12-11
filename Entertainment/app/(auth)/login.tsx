import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { router } from 'expo-router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email) {
      Alert.alert('Error', 'Please fill in email fields.');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please fill in password fields.');
      return;
    }
    // Check if email contains '@'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    // Add your login logic here
    Alert.alert('Success', `Welcome!`);
    router.replace('/(root)/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#757575"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#757575"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text
        style={styles.signup}
        onPress={() => {
          // Navigate to the sign-up screen
          router.replace('/(auth)/register');
          
          
        }}>   
            
            Don't have an account? Register
      </Text>
    </View>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA', // Light background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#212121', // Dark text
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF', // White background for input fields
    borderWidth: 1,
    borderColor: '#BDBDBD', // Light gray border
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212121', // Dark text in inputs
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#64B5F6', // Light blue
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  signup: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    color: '#64B5F6', // Light blue text for sign-up
    fontWeight: 'bold',
  },
});

export default LoginPage;
