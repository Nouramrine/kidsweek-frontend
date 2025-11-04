import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SignIn from "./_partials/SignIn";
import SignUp from "./_partials/SignUp";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import ScanModal from "../components/auth/Scan";

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [inviteToken, setInviteToken] = useState(null);
  const [qrModal, setQrModal] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/titre.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/*<KWText type='h1'>{isSignIn ? 'Connexion' : 'Inscription'}</KWText>*/}
      <KWModal visible={qrModal}>
        <ScanModal onReturn={(token) => {
          if (token) {
            console.log(token);
            setInviteToken(token);
          }
          setQrModal(false);
        }} />
      </KWModal>

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

      {!inviteToken && 
      <TouchableOpacity
        onPress={() => setQrModal(true)}
        style={styles.switchContainer}
      >
        <KWText type="link">Scanner un QR code d'invitation</KWText>
      </TouchableOpacity>
      }

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
