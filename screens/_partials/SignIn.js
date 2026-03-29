import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import KWTextInput from "../../components/KWTextInput";
import KWButton from "../../components/KWButton";
import KWText from "../../components/KWText";
import { signInAsync } from "../../reducers/user";

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  const handleSignIn = async () => {
    const signIn = await dispatch(
      signInAsync({
        email: signInEmail,
        password: signInPassword,
        inviteToken,
      }),
    ).unwrap();
    if (signIn.result) {
      setSignInEmail("");
      setSignInPassword("");
    } else {
      setSignInError(signIn.error);
    }
  };

  const handleForgotPass = () => {
    navigation.navigate("ForgetPassword", { email: signInEmail });
    setSignInPassword("");
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
      <KWButton title="Mot de passe oublié" onPress={handleForgotPass} />
    </View>
  );
};

export default SignIn;
