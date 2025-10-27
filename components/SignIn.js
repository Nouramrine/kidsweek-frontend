import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/globalStyles';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignIn = () => {
    console.log('Connexion avec', { email, password });
	
		fetch(`${BACKEND_URL}/members/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: signInEmail, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
          const { firstname, lastname, email, token } = data.member;
					dispatch(login({ lastname, firstname, email, token }));
					setEmail('');
					setPassword('');
				}
			});
	};

  return (
    <View>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={signInEmail}
        onChangeText={setSignInEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={signInPassword}
        onChangeText={setSignInPassword}
      />
      <Button title="Se connecter" onPress={handleSignIn} />
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