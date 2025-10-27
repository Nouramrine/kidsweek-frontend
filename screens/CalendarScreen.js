import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const CalendarScreen = (navigation) => {
  return (
    <View style={styles.container}>
      <Text>Calendar</Text>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
