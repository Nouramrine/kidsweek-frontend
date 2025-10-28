import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../theme/colors';
import KWCard from "../components/KWCard";
import KWText from "../components/KWText";
import { FontAwesome5 } from '@expo/vector-icons';

const FamillyScreen = (navigation) => {

  const membersData = [
    { id: "658961", firstName: "Papa", lastName: "Outé"},
    { id: "552638", firstName: "Maman", lastName: "Bobo"},
    { id: "552638", firstName: "Mamie", lastName: "Nova"},
    { id: "12356", firstName: "Lucas", lastName: "Rabine"},
    { id: "78569", firstName: "Anna", lastName: "Lefabète"},
  ]

  const zonesData = [
    { name: "Papa", color: "blue", members: ["658961", "12356"]},
    { name: "Maman", color: "red", members: ["552638","12356","78569"]},
    { name: "Mamie", color: "purple", members: ["12356","78569"]},

  ]

  const [zones, setZones] = useState(zonesData);
  const [members, setMembers] = useState(membersData);
  
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
      
        <View style={styles.zonesContainer}>
            {zones.map((zone) => (
              <KWCard color={zone.color} style={styles.zoneCard}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors[zone.color + '3'], padding: 10, borderRadius: 10 }}>
                      <FontAwesome5 name="home" size={24} color="white" />
                    </View>
                    <View>
                      <KWText>{zone.name}</KWText>
                      <KWText>{zone.members.length}</KWText>
                    </View>
                  </View>
                </View>
              </KWCard>              
            ))}
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
  zonesContainer: {
    width: '100%',
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
  },
  zoneCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
