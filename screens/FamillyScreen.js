import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const FamillyScreen = (navigation) => {
  return (
    <View style={styles.container}>
      <Text>Familly</Text>
    </View>
  );
};

export default FamillyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
