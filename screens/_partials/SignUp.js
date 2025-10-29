import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import KWButton from "../../components/KWButton";
import KWTextInput from "../../components/KWTextInput";
import KWText from "../../components/KWText";
import { SignupAsync } from "../../reducers/user";

const SignUp = () => {
  const dispatch = useDispatch();
  const [signUpFirstName, setSignUpFirstName] = useState("Kids1");
  const [signUpLastName, setSignUpLastName] = useState("Week1");
  const [signUpEmail, setSignUpEmail] = useState("user@kidsweek1.fr");
  const [signUpPassword, setSignUpPassword] = useState("Pass1234");
  const [signUpConfirm, setSignUpConfirm] = useState("Pass1234");
  const [signUpError, setSignUpError] = useState("");

  const handleSignUp = () => {
    if (signUpPassword !== signUpConfirm) {
      setSignUpError("Les mots de passe ne correspondent pas.");
      return;
    }

    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;
    if (!emailRegex.test(signUpEmail)) {
      setSignUpError(`Format d'adresse email incorrecte`);
      return;
    }

    dispatch(
      SignupAsync({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      })
    );

    setSignUpFirstName("");
    setSignUpLastName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpConfirm("");
  };

  return (
    <View>
      <KWTextInput
        label="Prénom"
        value={signUpFirstName}
        onChangeText={setSignUpFirstName}
      />
      <KWTextInput
        label="Nom"
        value={signUpLastName}
        onChangeText={setSignUpLastName}
      />
      <KWTextInput
        label="Email"
        value={signUpEmail}
        onChangeText={setSignUpEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <KWTextInput
        label="Mot de passe"
        secureTextEntry
        value={signUpPassword}
        onChangeText={setSignUpPassword}
      />
      <KWTextInput
        label="Confirmer le mot de passe"
        secureTextEntry
        value={signUpConfirm}
        onChangeText={setSignUpConfirm}
      />
      <KWText type="inputError">{signUpError}</KWText>
      <KWButton title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

export default SignUp;
