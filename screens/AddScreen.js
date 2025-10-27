import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const AddScreen = (navigation) => {
  return (
    <View style={styles.container}>
      <Text>Add</Text>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
