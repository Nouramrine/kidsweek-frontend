import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/globalStyles';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const SignUp = () => {

    const [signUpFirstname, setSignUpFirstname] = useState('');
    const [signUpLastname, setSignUpLastname] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirm, setSignUpConfirm] = useState('');

  const handleSignUp = () => {
    if (signUpPassword !== signUpConfirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

		fetch(`${BACKEND_URL}/members/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ firstname: signUpFirstname, lastname: signUpLastname, email: signUpEmail, password: signUpPassword }),
      }).then(response => response.json())
      .then(data => {
        if (data.result) {
          const { firstname, lastname, email, token } = data.member;
          dispatch(login({ firstname, lastname, email, token }));
          setSignUpFirstname('');
          setSignUpLastname('');
          setSignUpEmail('');
          setSignUpPassword('');
          setSignUpConfirm('');
          console.log('Inscription avec', { firstname, lastname, email, password });
        }
      });
  };

  return (
    <View>
      <TextInput
        style={globalStyles.input}
        placeholder="Prénom"
        value={signUpFirstname}
        onChangeText={setSignUpFirstname}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Nom"
        value={signUpLastname}
        onChangeText={setSignUpLastname}
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
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});