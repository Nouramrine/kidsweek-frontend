import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../theme/colors';
import { KWCard, KWCardHeader, KWCardIcon, KWCardTitle, KWCardButton, KWCardBody } from "../components/KWCard";
import KWText from "../components/KWText";
import { FontAwesome5 } from '@expo/vector-icons';
import KWButton from "../components/KWButton";

const FamillyScreen = (navigation) => {

  const membersData = [
    { id: "658961", firstName: "Papa", lastName: "Outé", isChildren: false },
    { id: "552638", firstName: "Maman", lastName: "Bobo", isChildren: false },
    { id: "552638", firstName: "Mamie", lastName: "Nova", isChildren: false },
    { id: "12356", firstName: "Lucas", lastName: "Rabine", isChildren: true },
    { id: "78569", firstName: "Anna", lastName: "Lefabète", isChildren: true},
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
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.topButtonsContainer}>
          <View style={styles.topButton}>
            <KWCard color={colors.green[0]}>
              <View style={{ flexDirection: 'row' }}><FontAwesome5 name="plus" size={24} color={colors.green[2]} /><FontAwesome5 name="user" size={40} color={colors.green[2]} /></View>
              <KWText style={styles.buttonTitle} color={colors.green[2]}>Ajouter</KWText>
              <KWText style={styles.buttonSubTitle} color={colors.green[2]}>membre</KWText>
            </KWCard>
          </View>
          <View style={styles.topButton}>
            <KWCard color={colors.yellow[0]}>
              <View style={{ flexDirection: 'row' }}><FontAwesome5 name="plus" size={24} color={colors.yellow[2]} /><FontAwesome5 name="home" size={40} color={colors.yellow[2]} /></View>
              <KWText style={styles.buttonTitle} color={colors.yellow[2]}>Ajouter</KWText>
              <KWText style={styles.buttonSubTitle} color={colors.yellow[2]}>zone</KWText>
            </KWCard>
          </View>
        </View>
      
        <View style={styles.zonesContainer}>
            <KWText type='h2'>Zones familiales</KWText>
            {zones.map((zone, i) => (
              <KWCard key={i} color={colors[zone.color][0]} style={styles.zoneCard}>
                <KWCardHeader>
                  <KWCardIcon>
                    <View style={{ backgroundColor: colors[zone.color][2], padding: 10, borderRadius: 10 }}>
                      <FontAwesome5 name="home" size={24} color="white" />
                    </View>
                  </KWCardIcon>
                  <KWCardTitle>
                    <KWText>{zone.name}</KWText>
                    <KWText>{zone.members.length} membres</KWText>
                  </KWCardTitle>
                  <KWCardButton>
                    <View style={{ backgroundColor: "#ffffff7a", justifyContent: 'center', alignItems: 'center', height: 30, width: 30, borderRadius: 100 }}>
                      <FontAwesome5 name="ellipsis-v" size={16} color={colors.text[0]} />
                    </View>
                  </KWCardButton>
                </KWCardHeader>
                <KWCardBody>
                  {zone.members.map((memberId, j) => {
                      const member = membersData.filter((m) => m.id === memberId)[0]
                      return (
                      <KWCard key={j} color="#ffffff8e" style={styles.memberCard}>
                        <KWCardHeader>
                          <KWCardIcon>
                            <View style={{ backgroundColor: colors[zone.color][2], padding: 10, borderRadius: 10 }}>
                              <FontAwesome5 name="user" size={24} color="white" />
                            </View>
                          </KWCardIcon>
                          <KWCardTitle>
                            <KWText>{member.firstName}</KWText>
                            {/*<KWText>1000 ans</KWText> */}
                          </KWCardTitle>
                          <KWCardButton>
                            <View style={{ backgroundColor: "#ffffff7a", justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100 }}>
                              {member.isChildren ? <KWText color={colors.blue[1]}>Enfant</KWText> : <KWText color={colors.red[1]}>Parent</KWText> }
                            </View>
                          </KWCardButton>
                        </KWCardHeader>
                      </KWCard>
                      )
                  })}
                  <KWButton icon="plus" title="Ajouter" bgColor="#ffffff7a" color={colors.text[0]} />
                </KWCardBody>
              </KWCard>              
            ))}
        </View>
      
        <View style={styles.membersContainer}>
          <KWText type='h2'>Tous les membres</KWText>
          {members.map((member, j) => {
              return (
              <KWCard key={j} color={colors.skin[0]} style={styles.memberCard}>
                <KWCardHeader>
                  <KWCardIcon>
                    <View style={{ backgroundColor: "#d4d4d4ff", padding: 10, borderRadius: 10 }}>
                      <FontAwesome5 name="user" size={24} color="white" />
                    </View>
                  </KWCardIcon>
                  <KWCardTitle>
                    <KWText>{member.firstName}</KWText>
                    <KWText>1000 ans</KWText>
                  </KWCardTitle>
                  <KWCardButton>
                      <View style={{ backgroundColor: "#ffffff7a", justifyContent: 'center', alignItems: 'center', height: 30, width: 30, borderRadius: 100 }}>
                        <FontAwesome5 name="trash" size={14} color={colors.error[0]} />
                      </View>
                  </KWCardButton>
                </KWCardHeader>
              </KWCard>
              )
          })}          
        </View>
      </View>
      </ScrollView>
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
  membersContainer: {
    width: '100%',
    padding: 10,
    marginTop: -20,
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
  memberCard: {
    marginTop: 10,
    padding: 10,
  },
});
