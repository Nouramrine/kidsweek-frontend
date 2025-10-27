import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/user";
import KWButton from "../../components/KWButton";
import KWTextInput from "../../components/KWTextInput";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const SignUp = () => {
  const dispatch = useDispatch();
  const [signUpFirstName, setSignUpFirstName] = useState('Kids');
  const [signUpLastName, setSignUpLastName] = useState("Week");
  const [signUpEmail, setSignUpEmail] = useState('user@kidsweek.fr');
  const [signUpPassword, setSignUpPassword] = useState('Pass1234');
  const [signUpConfirm, setSignUpConfirm] = useState('Pass1234');

  const handleSignUp = () => {
    if (signUpPassword !== signUpConfirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    console.log('test')

    fetch(`${BACKEND_URL}/members/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const { firstName, lastName, email, token } = data.member;
          dispatch(login({ firstName, lastName, email, token }));
          setSignUpFirstName("");
          setSignUpLastName("");
          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpConfirm("");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <KWTextInput
        style={styles.input}
        label="Prénom"
        value={signUpFirstName}
        onChangeText={setSignUpFirstName}
      />
      <KWTextInput
        style={styles.input}
        label="Nom"
        value={signUpLastName}
        onChangeText={setSignUpLastName}
      />
      <KWTextInput
        style={styles.input}
        label="Email"
        value={signUpEmail}
        onChangeText={setSignUpEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <KWTextInput
        style={styles.input}
        label="Mot de passe"
        secureTextEntry
        value={signUpPassword}
        onChangeText={setSignUpPassword}
      />
      <KWTextInput
        style={styles.input}
        label="Confirmer le mot de passe"
        secureTextEntry
        value={signUpConfirm}
        onChangeText={setSignUpConfirm}
      />
      <KWButton title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  input: {

  },
});
