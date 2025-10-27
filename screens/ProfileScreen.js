import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfilScreen = (navigation) => {
  return (
    <View style={styles.container}>
      <Text>Profil</Text>
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
