import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import KWTextInput from './KWTextInput';
import KWButton from './KWButton';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('user@kidsweek.fr');
  const [signInPassword, setSignInPassword] = useState('Pass1234');

  const dispatch = useDispatch()

  const handleSignIn = () => {
		fetch(`${BACKEND_URL}/members/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: signInEmail, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
        console.log('retour connexion : ', data)
				if (data.result) {
          const { firstName, lastName, email, token } = data.member;
					dispatch(login({ firstName, lastName, email, token }));
					setEmail('');
					setPassword('');
				}
			});
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
      <KWButton title="Se connecter" onPress={handleSignIn} />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});