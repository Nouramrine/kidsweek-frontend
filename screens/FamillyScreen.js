import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../theme/colors';
import KWCard from "../components/KWCard";
import KWText from "../components/KWText";
import { FontAwesome5 } from '@expo/vector-icons';

const FamillyScreen = (navigation) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topButtonsContainer}>
          <View style={styles.topButton}>
            <KWCard color="green">
              <View style={{ flexDirection: 'row' }}><FontAwesome5 name="plus" size={24} color={colors.green3} /><FontAwesome5 name="user" size={40} color={colors.green3} /></View>
              <KWText style={styles.buttonTitle} color="green3">Ajouter</KWText>
              <KWText style={styles.buttonSubTitle} color="green3">membre</KWText>
            </KWCard>
          </View>
          <View style={styles.topButton}>
            <KWCard color="yellow">
              <View style={{ flexDirection: 'row' }}><FontAwesome5 name="plus" size={24} color={colors.yellow3} /><FontAwesome5 name="home" size={40} color={colors.yellow3} /></View>
              <KWText style={styles.buttonTitle} color="yellow3">Ajouter</KWText>
              <KWText style={styles.buttonSubTitle} color="yellow3">zone</KWText>
            </KWCard>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FamillyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  topButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  topButton: {
    width: '50%',
    padding: 10,
  },
  buttonTitle: {
    fontSize: 16,
  },
  buttonSubTitle: {
    fontSize: 12,
  }
});
