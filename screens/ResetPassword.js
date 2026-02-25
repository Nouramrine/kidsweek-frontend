import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import KWText from "../components/KWText";

import { API_URL } from "../config/api";
import { logout } from "../reducers/user";

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const token = route.params?.token || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/members/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (data.result) {
        setSucces(true);
        dispatch(logout());
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "auth" }],
          });
        }, 2000);
      } else {
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <KWText type="h1">Nouveau mot de passe</KWText>

      <KWText style={styles.description}>
        Choisissez un nouveau mot de passe pour votre compte.
      </KWText>

      {!succes ? (
        <>
          <KWTextInput
            label="Nouveau mot de passe"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <KWTextInput
            label="Confirmer le mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {message ? <KWText type="inputError">{message}</KWText> : null}

          {loading ? (
            <ActivityIndicator color="#8E7EED" />
          ) : (
            <KWButton title="Réinitialiser" onPress={handleSubmit} />
          )}

          <KWButton
            title="Retour"
            variant="text"
            onPress={() => navigation.goBack()}
          />
        </>
      ) : (
        <KWText style={styles.successMessage}>
          ✅ Mot de passe mis à jour ! Vous allez être redirigé...
        </KWText>
      )}
    </View>
  );
};

export default ResetPassword;

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
  successMessage: {
    marginTop: 24,
    textAlign: "center",
  },
});
