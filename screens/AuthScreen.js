import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/globalStyles';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignIn ? 'Connexion' : 'Inscription'}</Text>

      {isSignIn ? <SignIn /> : <SignUp />}

      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)} style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isSignIn
            ? "Pas de compte ? S'inscrire"
            : 'Déjà un compte ? Se connecter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  switchContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#007BFF',
    fontWeight: '600',
  },
});