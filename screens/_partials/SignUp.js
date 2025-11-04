import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useDispatch } from "react-redux";
import KWButton from "../../components/KWButton";
import KWTextInput from "../../components/KWTextInput";
import KWText from "../../components/KWText";
import { signUpAsync } from "../../reducers/user";

const SignUp = () => {
  const dispatch = useDispatch();
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const handleSignUp = async () => {
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
    const signUp = await dispatch(
      signUpAsync({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      })
    ).unwrap();

    if(signUp.result) {
      setSignUpFirstName("");
      setSignUpLastName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpConfirm("");
    } else {
      setSignUpError(signUp.error)
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ width: '80%', alignItems: 'center' }}
    >
      <View style={{ marginBottom: 20 }}>
        <KWButton 
          title="User1" 
          onPress={() => { 
            setSignUpEmail("user@kidsweek.fr");
            setSignUpFirstName("Parent");
            setSignUpLastName("Famille1");
            setSignUpPassword('Pass12345!');
            setSignUpConfirm('Pass12345!');
            
          }}
        />
        <KWButton 
          title="User2" 
          onPress={() => { 
            setSignUpEmail("user2@kidsweek.fr");
            setSignUpFirstName("Parent2");
            setSignUpLastName("Famille1");
            setSignUpPassword('Pass12345!');
            setSignUpConfirm('Pass12345!');
            
          }}
        />
        <KWButton 
          title="User3" 
          onPress={() => { 
            setSignUpEmail("user3@kidsweek.fr");
            setSignUpFirstName("Parent3");
            setSignUpLastName("Famille1");
            setSignUpPassword('Pass12345!');
            setSignUpConfirm('Pass12345!');
            
          }}
        />
      </View>


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

    </KeyboardAvoidingView>
  );
};

export default SignUp;
