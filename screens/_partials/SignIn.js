import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import KWTextInput from "../../components/KWTextInput";
import KWButton from "../../components/KWButton";
import KWText from "../../components/KWText";
import { signInAsync } from "../../reducers/user";

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
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

      <View style={{ marginBottom: 20 }}>
        <KWButton 
          title="User1" 
          onPress={() => { 
            setSignInEmail("user@kidsweek.fr");
            setSignInPassword('Pass1234');
          }}
        />
        <KWButton 
          title="User2" 
          onPress={() => { 
            setSignInEmail("user2@kidsweek.fr");
            setSignInPassword('Pass12345!');
          }}
        />
        <KWButton 
          title="User3" 
          onPress={() => { 
            setSignInEmail("user3@kidsweek.fr");
            setSignInPassword('Pass12345!');
          }}
        />
      </View>

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
