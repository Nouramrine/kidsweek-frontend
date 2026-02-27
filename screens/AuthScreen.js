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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useDispatch } from "react-redux";

import SignIn from "./_partials/SignIn";
import SignUp from "./_partials/SignUp";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import ScanModal from "../components/auth/Scan";
import { googleAuthAsync } from "../reducers/user";

WebBrowser.maybeCompleteAuthSession();

const GoogleButton = ({ onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={styles.googleButton}
    activeOpacity={0.8}
  >
    <Image
      source={{
        uri: "https://developers.google.com/identity/images/g-logo.png",
      }}
      style={styles.googleLogo}
    />
    <KWText style={styles.googleButtonText}>Continuer avec Google</KWText>
  </TouchableOpacity>
);

const AuthScreen = () => {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [inviteToken, setInviteToken] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "803261479896-rjr0gfd2gfmumv9aqrdfuai7k2m1i11q.apps.googleusercontent.com",
  });

  useEffect(() => {
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleDeepLink({ url: initialUrl });
    };
    getInitialURL();
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleAuth(id_token);
    } else if (response?.type === "error") {
      setGoogleError("Erreur lors de la connexion Google.");
    }
  }, [response]);

  const handleDeepLink = ({ url }) => {
    const { path, queryParams } = Linking.parse(url);
    if (path === "invite" && queryParams?.token) {
      setInviteToken(queryParams.token);
      setIsSignIn(false);
    }
  };

  const handleGoogleAuth = async (idToken) => {
    const result = await dispatch(googleAuthAsync({ idToken })).unwrap();
    if (!result.result) {
      setGoogleError(result.error || "Erreur Google Auth");
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
        {!isSignIn ? <SignUp inviteToken={inviteToken} /> : <SignIn />}
      </View>

      {googleError ? <KWText type="inputError">{googleError}</KWText> : null}

      <GoogleButton onPress={() => promptAsync()} disabled={!request} />

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DADCE0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#3C4043",
    fontSize: 15,
    fontWeight: "500",
  },
});
