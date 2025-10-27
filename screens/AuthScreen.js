import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import KWText from '../components/KWText';

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <View style={styles.container}>
      <KWText type='h1'>{isSignIn ? 'Connexion' : 'Inscription'}</KWText>

      {isSignIn ? <SignIn /> : <SignUp />}

      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)} style={styles.switchContainer}>
        <KWText type='link'>
          {isSignIn
            ? "Pas de compte ? S'inscrire"
            : 'Déjà un compte ? Se connecter'}
        </KWText>
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
  switchContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});