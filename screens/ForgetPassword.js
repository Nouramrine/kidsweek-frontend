import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import KWText from "../components/KWText";

import { API_URL } from "../config/api";

const ForgetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState(route.params?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/members/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.result) {
        setMessage(
          "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        );
      } else {
        setMessage(
          data.error || "Une erreur est survenue. Veuillez réessayer.",
        );
      }
    } catch (error) {
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KWText type="h1">Mot de passe oublié</KWText>

      <KWText style={styles.description}>
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </KWText>

      <KWTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <KWButton title="Envoyer le lien" onPress={handleSubmit} />
      )}

      {message ? <KWText style={styles.message}>{message}</KWText> : null}

      <KWButton
        title="Retour"
        variant="text"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  description: {
    marginBottom: 16,
  },
  message: {
    marginTop: 16,
    textAlign: "center",
  },
});
