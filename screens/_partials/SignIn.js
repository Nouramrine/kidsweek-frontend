import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from "../../reducers/user";
import KWTextInput from '../../components/KWTextInput';
import KWButton from '../../components/KWButton';
import KWText from '../../components/KWText';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('user@kidsweek.fr');
  const [signInPassword, setSignInPassword] = useState('Pass1234');
  const [signInError, setSignInError] = useState('');


  const dispatch = useDispatch()

  const handleSignIn = () => {
		fetch(`${BACKEND_URL}/members/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: signInEmail, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
          const { firstName, lastName, email, token } = data.member;
					dispatch(login({ firstName, lastName, email, token }));
					setSignInEmail('');
					setSignInPassword('');
				} else {
          setSignInError(data.error)
        }
			})
      .catch((error) => console.log(error));
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
      <KWText type='inputError'>{signInError}</KWText>
      <KWButton title="Se connecter" onPress={handleSignIn} />
    </View>
  );
};

export default SignIn;
