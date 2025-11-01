import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";

const ProfilScreen = ({ navigation , member, onReturn }) => {
  const dispatch = useDispatch();
  const handledisconnect = () => {
    dispatch(logout());
  };
  return (
    <View style={styles.container}>
      <Text>Profil</Text>
      
      {member ? <Button title="Retour" onPress={onReturn} /> : <Button title="Deconnexion" onPress={handledisconnect} />}
    </View>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
