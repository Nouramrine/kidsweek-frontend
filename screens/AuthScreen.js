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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useDispatch } from "react-redux";

import SignIn from "./_partials/SignIn";
import SignUp from "./_partials/SignUp";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import ScanModal from "../components/auth/Scan";
import { googleAuthAsync } from "../reducers/user";

GoogleSignin.configure({
  webClientId:
    "803261479896-rjr0gfd2gfmumv9aqrdfuai7k2m1i11q.apps.googleusercontent.com",
});

const AuthScreen = () => {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [inviteToken, setInviteToken] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleDeepLink({ url: initialUrl });
    };
    getInitialURL();
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleDeepLink = ({ url }) => {
    const { path, queryParams } = Linking.parse(url);
    if (path === "invite" && queryParams?.token) {
      setInviteToken(queryParams.token);
      setIsSignIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (!idToken) {
        setGoogleError("Impossible de récupérer le token Google.");
        return;
      }

      const result = await dispatch(googleAuthAsync({ idToken })).unwrap();
      if (!result.result) {
        setGoogleError(result.error || "Erreur Google Auth");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // L'utilisateur a annulé, pas d'erreur à afficher
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setGoogleError("Connexion déjà en cours.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGoogleError("Google Play Services non disponible.");
      } else {
        setGoogleError("Une erreur est survenue avec Google.");
      }
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
            if (token) setInviteToken(token);
            setQrModal(false);
          }}
        />
      </KWModal>

      <View style={styles.formContainer}>
        {!isSignIn ? (
          <SignUp inviteToken={inviteToken} />
        ) : (
          <SignIn inviteToken={inviteToken} />
        )}
      </View>

      {googleError ? <KWText type="inputError">{googleError}</KWText> : null}

      {!inviteToken && (
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleGoogleSignIn}
        />
      )}

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
  googleButton: {
    width: "100%",
    height: 48,
    marginTop: 16,
  },
});
