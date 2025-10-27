import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { globalStyles } from "../theme/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../reducers/user";

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
        console.log(data);
        if (data.result) {
          const { firstName, lastName, email, token } = data.member;
          dispatch(login({ firstName, lastName, email, token }));
          setSignUpFirstName("");
          setSignUpLastName("");
          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpConfirm("");
          console.log("Inscription avec", {
            firstName,
            lastName,
            email,
            password,
          });
        }
      });
  };

  return (
    <View>
      <TextInput
        style={globalStyles.input}
        placeholder="Prénom"
        value={signUpFirstName}
        onChangeText={setSignUpFirstName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Nom"
        value={signUpLastName}
        onChangeText={setSignUpLastName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={signUpEmail}
        onChangeText={setSignUpEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={signUpPassword}
        onChangeText={setSignUpPassword}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        value={signUpConfirm}
        onChangeText={setSignUpConfirm}
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
