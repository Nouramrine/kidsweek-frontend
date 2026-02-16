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
} from "../components/KWCard";
import KWText from "../components/KWText";
import KWModal from "../components/KWModal";
import KWDropDown from "../components/KWDropDown";
import ZoneForm from "../components/zone/Form";
import MemberForm from "../components/member/Form";
import MemberAdd from "../components/member/Add";
import InviteForm from "../components/member/Invite";
import TutorialBanner from "../components/TutorialBanner";
import ZoneCard from "../components/zone/Zonecard";
import MemberCardSimple from "../components/member/Membercardsimple";

import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchZonesAsync,
  deleteZoneAsync,
  removeMemberFromZoneAsync,
  addMemberToZoneAsync,
} from "../reducers/zones";
import { fetchMembersAsync, deleteMemberAsync } from "../reducers/members";
import { dismissTutorialAsync } from "../reducers/user";

const FamillyScreen = () => {
  const dispatch = useDispatch();

  const zones = useSelector((state) => state.zones.value);
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);

  // États pour les modals
  const [zoneModal, setZoneModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [memberModal, setMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addMemberToZoneModal, setAddMemberToZoneModal] = useState(false);
  const [invitationModal, setInvitationModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Fetch initial des données
  useEffect(() => {
    dispatch(fetchZonesAsync());
    dispatch(fetchMembersAsync());
  }, []);

  useEffect(() => {
    dispatch(fetchZonesAsync());
  }, [members]);

  // Logique des tutoriels
  const dismissedTooltips = user.tutorialState?.dismissedTooltips || [];
  const shouldShowZoneTutorial =
    zones.length === 0 && !dismissedTooltips.includes("createZone");
  const shouldShowMemberTutorial =
    members.length === 0 &&
    !dismissedTooltips.includes("createMember") &&
    dismissedTooltips.includes("createZone");

  const handleDismissTooltip = (tooltipId) => {
    dispatch(dismissTutorialAsync({ token: user.token, tooltipId }));
  };

  // Handlers pour les zones
  const handleEditZone = (zone) => {
    setSelectedZone(zone);
    setZoneModal(true);
  };

  const handleDeleteZone = (zoneId) => {
    dispatch(deleteZoneAsync(zoneId));
  };

  const handleAddMemberToZone = (zone) => {
    setSelectedZone(zone);
    setAddMemberToZoneModal(true);
  };

  const handleRemoveMemberFromZone = (zoneId, memberId) => {
    dispatch(removeMemberFromZoneAsync({ zoneId, memberId }));
  };

  // Handlers pour les membres
  const handleEditMember = (member) => {
    setSelectedMember({ member });
    setMemberModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteMember = (memberId) => {
    dispatch(deleteMemberAsync(memberId));
    setOpenDropdownId(null);
  };

  const handleInviteMember = (member) => {
    setSelectedMember({ member });
    setInvitationModal(true);
    setOpenDropdownId(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* Tutoriels */}
        <TutorialBanner
          id="createZone"
          message="Créez votre première zone familiale pour organiser votre foyer (maison, grands-parents...)"
          ctaLabel="Créer une zone"
          onCta={() => {
            setSelectedZone(null);
            setZoneModal(true);
            handleDismissTooltip("createZone");
          }}
          onDismiss={() => handleDismissTooltip("createZone")}
          visible={shouldShowZoneTutorial}
          bgColor={colors.yellow[0]}
        />

        <TutorialBanner
          id="createMember"
          message="Ajoutez maintenant les membres de votre famille (enfants, parents...)"
          ctaLabel="Ajouter un membre"
          onCta={() => {
            setSelectedMember(null);
            setMemberModal(true);
            handleDismissTooltip("createMember");
          }}
          onDismiss={() => handleDismissTooltip("createMember")}
          visible={shouldShowMemberTutorial}
          bgColor={colors.green[0]}
        />

        {/* Modals */}
        <KWModal visible={zoneModal}>
          <ZoneForm
            zone={selectedZone}
            onReturn={() => {
              setZoneModal(false);
              setOpenDropdownId(null);
            }}
          />
        </KWModal>

        <KWModal visible={addMemberToZoneModal}>
          <MemberAdd
            currentMembers={selectedZone?.members}
            onReturn={(member) => {
              if (member)
                dispatch(
                  addMemberToZoneAsync({
                    zoneId: selectedZone?._id,
                    memberId: member._id,
                  }),
                );
              setSelectedZone(null);
              setAddMemberToZoneModal(false);
            }}
          />
        </KWModal>

        <KWModal visible={invitationModal}>
          <InviteForm
            data={selectedMember}
            onReturn={() => {
              setSelectedMember(null);
              setOpenDropdownId(null);
              setInvitationModal(false);
            }}
          />
        </KWModal>

        <KWModal visible={memberModal}>
          <MemberForm
            data={selectedMember}
            onReturn={() => {
              setMemberModal(false);
              setOpenDropdownId(null);
            }}
          />
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
              testID="zone-btn"
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
              }}
              testID="member-btn"
            >
              <KWCard color={colors.green[0]}>
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome5 name="plus" size={24} color={colors.green[2]} />
                  <FontAwesome5 name="user" size={40} color={colors.green[2]} />
                </View>
                <KWText style={styles.buttonTitle} color={colors.green[2]}>
                  Ajouter
                </KWText>
                <KWText style={styles.buttonSubTitle} color={colors.green[2]}>
                  membre
                </KWText>
              </KWCard>
            </TouchableOpacity>
          </View>

          {/* Section Zones familiales */}
          <View style={styles.zonesContainer}>
            <KWText type="h2">Zones familiales</KWText>
            {!zones.length && (
              <KWText style={styles.emptyText}>Aucune zone</KWText>
            )}
            {zones.map((zone, i) => (
              <ZoneCard
                key={i}
                zone={zone}
                onEdit={handleEditZone}
                onDelete={handleDeleteZone}
                onAddMember={handleAddMemberToZone}
                onRemoveMember={handleRemoveMemberFromZone}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
              />
            ))}
          </View>

          {/* Section Tous les membres */}
          <View style={styles.membersContainer}>
            <KWText type="h2">Tous les membres</KWText>
            {!members.length && (
              <KWText style={styles.emptyText}>Aucun membre</KWText>
            )}
            {members.map((member, j) => {
              // Ne pas afficher l'utilisateur courant
              if (member.isCurrent) return null;

              // Options du dropdown
              const options = [
                { action: "edit", label: "Modifier", icon: "pen" },
                {
                  action: "delete",
                  label: "Supprimer",
                  color: colors.error[0],
                  icon: "trash",
                },
              ];

              // Ajouter l'option d'invitation pour les membres locaux
              if (member.type === "local") {
                options.unshift({
                  action: "invitation",
                  label: "Inviter",
                  icon: "paper-plane",
                });
              }

              return (
                <KWCard
                  key={j}
                  color={
                    member.color ? colors[member.color][0] : colors.skin[0]
                  }
                  style={styles.memberCard}
                >
                  <KWCardHeader>
                    <KWCardIcon>
                      <View style={styles.iconContainer}>
                        <FontAwesome5 name="user" size={24} color="white" />
                      </View>
                    </KWCardIcon>
                    <KWCardTitle>
                      <KWText>{member.firstName}</KWText>
                    </KWCardTitle>
                    <KWCardButton>
                      <KWDropDown
                        id={member._id}
                        icon="ellipsis-v"
                        options={options}
                        openId={openDropdownId}
                        setOpenId={setOpenDropdownId}
                        onSelect={(action) => {
                          if (action === "invitation") {
                            handleInviteMember(member);
                          }
                          if (action === "edit") {
                            handleEditMember(member);
                          }
                          if (action === "delete") {
                            handleDeleteMember(member._id);
                          }
                        }}
                      />
                    </KWCardButton>
                  </KWCardHeader>
                </KWCard>
              );
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
    padding: 10,
  },
  membersContainer: {
    width: "100%",
    padding: 10,
    marginTop: -20,
  },
  topButtonsContainer: {
    width: "100%",
    flexDirection: "row",
  },
  topButton: {
    width: "50%",
    padding: 10,
  },
  buttonTitle: {
    fontSize: 16,
  },
  buttonSubTitle: {
    fontSize: 12,
  },
  memberCard: {
    marginTop: 10,
    padding: 10,
  },
  iconContainer: {
    backgroundColor: "#d4d4d4ff",
    padding: 10,
    borderRadius: 10,
  },
  emptyText: {
    padding: 25,
    width: "100%",
    textAlign: "center",
  },
});
