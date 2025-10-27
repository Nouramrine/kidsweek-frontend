import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SignUp = () => {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

  const handleSignUp = () => {
    if (password !== confirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    console.log('Inscription avec', { firstname, lastname, email, password });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstname}
        onChangeText={setFirstname}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastname}
        onChangeText={setLastname}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
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