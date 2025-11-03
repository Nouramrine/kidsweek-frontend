import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import * as Linking from 'expo-linking';
import SignIn from "./_partials/SignIn";
import SignUp from "./_partials/SignUp";
import KWText from "../components/KWText";

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const sub = Linking.addEventListener('url', (event) => {
      const url = new URL(event.url);
      const t = url.searchParams.get('token');
      if (t) {
        setToken(t);
        setIsSignIn(false);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: '80%', alignItems: 'center' }}
      > */}
      <Image
        source={require("../assets/titre.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/*<KWText type='h1'>{isSignIn ? 'Connexion' : 'Inscription'}</KWText>*/}

      <View style={styles.formContainer}>
        {isSignIn ? <SignIn /> : <SignUp />}
      </View>

      <TouchableOpacity
        onPress={() => setIsSignIn(!isSignIn)}
        style={styles.switchContainer}
      >
        <KWText type="link">
          {isSignIn
            ? "Pas de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </KWText>
      </TouchableOpacity>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  switchContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
  },
  logo: {
    width: "80%",
    height: undefined,
    aspectRatio: 3,
    marginBottom: 30,
  },
});
