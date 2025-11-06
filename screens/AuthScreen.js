import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import SignIn from "./_partials/SignIn";
import SignUp from "./_partials/SignUp";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import ScanModal from "../components/auth/Scan";

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [inviteToken, setInviteToken] = useState(null);
  const [qrModal, setQrModal] = useState(false);

  useEffect(() => {
    // Vérifier si l'app a été ouverte avec un lien
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };

    getInitialURL();

    // Écouter les liens pendant que l'app est ouverte
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    const { path, queryParams } = Linking.parse(url);

    if (path === "invite" && queryParams?.token) {
      console.log("Token reçu:", queryParams.token);
      setInviteToken(queryParams.token);
      setIsSignIn(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Image
        source={require("../assets/titre.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <KWModal visible={qrModal}>
        <ScanModal
          onReturn={(token) => {
            if (token) {
              console.log(token);
              setInviteToken(token);
            }
            setQrModal(false);
          }}
        />
      </KWModal>

      <View style={styles.formContainer}>
        {!isSignIn ? <SignUp inviteToken={inviteToken} /> : <SignIn />}
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

      {!inviteToken && (
        <TouchableOpacity
          onPress={() => setQrModal(true)}
          style={styles.switchContainer}
        >
          <KWText type="link">Scanner un QR code d'invitation</KWText>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
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
