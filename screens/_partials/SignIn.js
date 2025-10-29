import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import KWTextInput from "../../components/KWTextInput";
import KWButton from "../../components/KWButton";
import KWText from "../../components/KWText";
import { signInAsync } from "../../reducers/user";

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState("user@kidsweek.fr");
  const [signInPassword, setSignInPassword] = useState("Pass1234");
  const [signInError, setSignInError] = useState("");

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    const signIn = await dispatch(
      signInAsync({
        email: signInEmail,
        password: signInPassword,
      })
    ).unwrap();
    console.log(signIn)
    if (signIn.result) {
      setSignInEmail("");
      setSignInPassword("");
    } else {
      setSignInError(signIn.error)
    }
  };

  return (
    <View>
      <KWTextInput
        label="Email"
        value={signInEmail}
        onChangeText={setSignInEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <KWTextInput
        label="Mot de passe"
        secureTextEntry
        value={signInPassword}
        onChangeText={setSignInPassword}
      />
      <KWText type="inputError">{signInError}</KWText>
      <KWButton title="Se connecter" onPress={handleSignIn} />
    </View>
  );
};

export default SignIn;
