import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
  KWCardBody,
} from "../components/KWCard";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import KWButton from "../components/KWButton";
import KWDropDown from "../components/KWDropDown";
import ZoneForm from "../components/zone/Form";
import MemberForm from "../components/member/Form";
import MemberAdd from "../components/member/Add";
import Invite from "../components/member/Invite";

import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchZonesAsync,
  deleteZoneAsync,
  removeMemberFromZoneAsync,
  addMemberToZoneAsync,
} from "../reducers/zones";
import { fetchMembersAsync, deleteMemberAsync } from "../reducers/members";
import { saveTutorialStepAsync } from "../reducers/user";

const FamillyScreen = () => {
  const dispatch = useDispatch();

  const zones = useSelector((state) => state.zones.value);
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);
  const invites = useSelector((state) => state.invites.value);
  const tutorialStep = user.tutorialStep || 0;

  // Modals
  const [zoneModal, setZoneModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const [memberModal, setMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [addMemberToZoneModal, setAddMemberToZoneModal] = useState(false);

  // Pour affichage modal d'invitation
  const [invitationModal, setInvitationModal] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null); // id du membre sur lequel le dropdown est ouvert (dropdown unique)
  
  useEffect(() => {
    dispatch(fetchZonesAsync());
    dispatch(fetchMembersAsync());
  }, []);

  // ✅ Fonctions pour avancer le tuto
  const finishStepZone = () => {
    setZoneModal(false);
    dispatch(saveTutorialStepAsync({ email: user.email, step: 2 }));
  };

  const finishStepMember = () => {
    setMemberModal(false);
    dispatch(saveTutorialStepAsync({ email: user.email, step: 3 })); // Fin du tutoriel
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>

        {/* --- Modals Tutoriel --- 
        {tutorialStep === 1 && (
          <KWModal visible={zones.length ? false : true}>
            <KWText
              type="h2"
              style={{
                fontWeight: "bold",
                marginBottom: 15,
                color: colors.purple[2],
              }}
            >
              Étape 1 : Zone familiale 🏠
            </KWText>
            <KWText style={{ marginBottom: 20, lineHeight: 22 }}>
              Une zone représente un lieu (votre maison, celle des
              grands-parents...). Créez votre première zone pour y ajouter vos
              membres.
            </KWText>
            <KWButton
              title="Créer une zone"
              bgColor={colors.yellow[1]}
              onPress={() => {
                setSelectedZone(null);
                setZoneModal(true);
              }}
            />
          </KWModal>
        )}
        */}

        {/* Modal création / édition de Zone */}
        <KWModal visible={zoneModal}>
          <ZoneForm 
            zone={selectedZone} 
            onReturn={() => { 
              setZoneModal(false);
              setOpenDropdownId(null);
            }} />
        </KWModal>

        {/* Modal Ajout d'un membre à la zone */}
        <KWModal visible={addMemberToZoneModal}>
          <MemberAdd 
            currentMembers={selectedZone?.members}
            onReturn={(member) => {
              if(member) dispatch(addMemberToZoneAsync({ zoneId: selectedZone?._id, memberId: member._id }))
              setSelectedZone(null);
              setAddMemberToZoneModal(false);
            }} />
        </KWModal>

        {/* Modal invitation */}
        <KWModal visible={invitationModal}>
          <Invite 
            data={selectedMember}
            onReturn={() => {
              setSelectedMember(null);
              setOpenDropdownId(null);
              setInvitationModal(false);
            }} />
        </KWModal>

        {/* Boutons d'ajout */}
        <View style={styles.container}>
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity 
              style={styles.topButton} 
              onPress={() => { 
                setSelectedZone(null);
                setZoneModal(true);
              }}
            >
              <KWCard color={colors.yellow[0]}>
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome5
                    name="plus"
                    size={24}
                    color={colors.yellow[2]}
                  />
                  <FontAwesome5
                    name="home"
                    size={40}
                    color={colors.yellow[2]}
                  />
                </View>
                <KWText style={styles.buttonTitle} color={colors.yellow[2]}>
                  Ajouter
                </KWText>
                <KWText style={styles.buttonSubTitle} color={colors.yellow[2]}>
                  zone
                </KWText>
              </KWCard>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.topButton} 
              onPress={() => { 
                setSelectedMember(null);
                setMemberModal(true);
              }}>
              <KWCard color={colors.green[0]}>
                <View style={{ flexDirection: 'row' }}>
                  <FontAwesome5 name="plus" size={24} color={colors.green[2]} />
                  <FontAwesome5 name="user" size={40} color={colors.green[2]} />
                </View>
                <KWText style={styles.buttonTitle} color={colors.green[2]}>Ajouter</KWText>
                <KWText style={styles.buttonSubTitle} color={colors.green[2]}>membre</KWText>
              </KWCard>
            </TouchableOpacity>
          </View>

          {/* Zones */}
          <View style={styles.zonesContainer}>
            <KWText type="h2">Zones familiales</KWText>
            {!zones.length && (
              <KWText style={styles.emptyText}>Aucune zone</KWText>
            )}
            {zones.map((zone, i) => (
              <KWCard
                key={i}
                color={colors[zone.color][0]}
                style={styles.zoneCard}
              >
                <KWCardHeader>
                  <KWCardIcon>
                    <View
                      style={{
                        backgroundColor: colors[zone.color][2],
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <FontAwesome5 name="home" size={24} color="white" />
                    </View>
                  </KWCardIcon>
                  <KWCardTitle>
                    <KWText>{zone.name}</KWText>
                    <KWText>{zone.members.length} membres</KWText>
                  </KWCardTitle>
                  <KWCardButton>
                    {zone.authLevel === "admin" && (
                      <KWDropDown
                        id={zone._id}
                        icon="ellipsis-v"
                        options={[
                          { action: "edit", label: "Modifier", icon: "pen" },
                          {
                            action: "delete",
                            label: "Supprimer",
                            color: colors.error[0],
                            icon: "trash",
                          },
                        ]}
                        openId={openDropdownId}
                        setOpenId={setOpenDropdownId}
                        onSelect={(action) => {
                          if (action === "edit") {
                            setSelectedZone(zone);
                            setZoneModal(true);
                          }
                          if (action === "delete") {
                            dispatch(deleteZoneAsync(zone._id));
                            setOpenDropdownId(null);
                          }
                        }}
                      />
                    )}
                  </KWCardButton>
                </KWCardHeader>

                <KWCardBody>
                  {/* Membres de la zone */}
                  {zone.members.map((member, j) => {
                    return (
                      <KWCard key={j} color={colors.background[1]} style={styles.memberCard}>
                        <KWCardHeader>
                          <KWCardIcon>
                            <View style={{ backgroundColor: colors[zone.color][2], padding: 10, borderRadius: 10 }}>
                              <FontAwesome5 name="user" size={24} color="white" />
                            </View>
                          </KWCardIcon>
                          <KWCardTitle>
                            <KWText>{member.firstName}</KWText>
                          </KWCardTitle>
                          <KWCardButton>
                            <View style={{ backgroundColor: colors.background[1], justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 100 }}>
                              {member.isChildren ? <KWText color={colors.blue[1]}>Enfant</KWText> : <KWText color={colors.red[1]}>{member.authLevel === 'admin' ? 'Propriétaire' : 'Parent'}</KWText>}
                            </View>
                            {member.isChildren && <TouchableOpacity style={styles.iconBtn} onPress={() => dispatch(removeMemberFromZoneAsync({ zoneId: zone._id, memberId: member._id }))}><FontAwesome5 name="minus" size={13} color="white" /></TouchableOpacity>}
                          </KWCardButton>
                        </KWCardHeader>
                      </KWCard>
                    );
                  })}
                  <KWButton 
                    icon="plus" 
                    title="Ajouter un membre" 
                    bgColor={colors.background[1]} 
                    color={colors.text[0]} 
                    onPress={() => { 
                      setSelectedZone(zone)
                      setAddMemberToZoneModal(true);
                    }}
                  />
                </KWCardBody>
              </KWCard>
            ))}
          </View>

          {/* Modal création / édition de Membre */}
          <KWModal visible={memberModal}>
            <MemberForm 
              data={selectedMember} 
              onReturn={() => { 
                setMemberModal(false);
                setOpenDropdownId(null);
              }} />
          </KWModal>

          {/* Membres */}
          <View style={styles.membersContainer}>
            <KWText type='h2'>Tous les membres</KWText>
            {!members.length && <KWText style={styles.emptyText}>Aucun membre</KWText>}
            {members.map((member, j) => {
                const options = [
                  {action: 'edit', label: 'Modifier', icon: 'pen'},
                  {action: 'delete', label: 'Supprimer', color: colors.error[0], icon: 'trash'},
                ];
                if (member.type === 'local') options.unshift({action: 'invitation', label: 'Inviter', icon: 'paper-plane'});
                return (
                  <KWCard key={j} color={member.color ? colors[member.color][0] : colors.skin[0]} style={styles.memberCard}>
                    <KWCardHeader>
                      <KWCardIcon>
                        <View style={{ backgroundColor: "#d4d4d4ff", padding: 10, borderRadius: 10 }}>
                          <FontAwesome5 name="user" size={24} color="white" />
                        </View>
                      </KWCardIcon>
                      <KWCardTitle>
                        <KWText>{member.firstName}</KWText>
                        {/* <KWText>1000 ans</KWText> */}
                      </KWCardTitle>
                      <KWCardButton>
                        <KWDropDown
                          id={member._id}
                          icon="ellipsis-v"
                          options={options}
                          openId={openDropdownId}
                          setOpenId={setOpenDropdownId}
                          onSelect={(action) => {
                            if(action === 'invitation'){
                              setSelectedMember({ member });
                              setInvitationModal(true);
                              setOpenDropdownId(null);
                            }
                            if(action === 'edit'){
                              setSelectedMember({ member });
                              setMemberModal(true);
                              setOpenDropdownId(null);
                            }
                            if(action === 'delete'){
                              dispatch(deleteMemberAsync(member._id));
                              setOpenDropdownId(null);
                            }
                          }}
                        />
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
    width: "100%", 
    padding: 10 
  },
  membersContainer: { 
    width: "100%", 
    padding: 10, 
    marginTop: -20 
  },
  topButtonsContainer: { 
    width: "100%", 
    flexDirection: "row" 
  },
  topButton: { 
    width: "50%", 
    padding: 10 
  },
  buttonTitle: { 
    fontSize: 16 
  },
  buttonSubTitle: { 
    fontSize: 12 
  },
  zoneCard: { 
    marginBottom: 20 
  },
  memberCard: { 
    marginTop: 10, 
    padding: 10 
  },
  emptyText: { 
    padding: 25, 
    width: "100%", 
    textAlign: "center" 
  },
  iconBtn: { 
    padding: 5, 
    borderRadius: 50, 
    backgroundColor: colors.error[0] 
  },
});
