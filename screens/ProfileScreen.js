import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { colors } from "../theme/colors";
import { logout } from "../reducers/user";
import KWButton from "../components/KWButton";
import KWModal from "../components/KWModal";
import { FontAwesome5 } from "@expo/vector-icons";
import KWText from "../components/KWText";
import {
  KWCard,
  KWCardHeader,
  KWCardTitle,
  KWCardButton,
} from "../components/KWCard";
import { fetchInvitesAsync } from "../reducers/invites";
import { updateMemberAsync, fetchMembersAsync } from "../reducers/members";
import ProfileEditForm from "../components/profile/ProfileEditForm";

const ProfilScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const invites = useSelector((state) => state.invites.value);

  const member = members.filter((m) => m.token === user.token)[0];

  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    dispatch(fetchInvitesAsync());
  }, []);

  const handledisconnect = () => {
    dispatch(logout());
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      await dispatch(
        updateMemberAsync({
          id: member._id,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          avatar: updatedData.avatar,
          color: updatedData.color,
          isChildren: member.isChildren,
        }),
      ).unwrap();

      // Recharger les membres pour s'assurer d'avoir les données à jour
      await dispatch(fetchMembersAsync()).unwrap();

      setEditProfile(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  const getInviteStatus = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "rejected":
        return "Refusée";
      case "expired":
        return "Expirée";
      default:
        return "N.C.";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return colors.orange[1];
      case "accepted":
        return colors.green[1];
      case "rejected":
        return colors.red[1];
      case "expired":
        return colors.text[1];
      default:
        return colors.text[0];
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: member?.color
              ? colors[member.color]?.[1] || colors.purple[1]
              : colors.purple[1],
          },
        ]}
      >
        <FontAwesome5
          name={member?.avatar || "user"}
          size={100}
          color="white"
        />
      </View>

      {/* Nom complet */}
      <KWText style={styles.memberTitle}>
        {member?.firstName} {member?.lastName}
      </KWText>

      {/* Lien de modification */}
      <TouchableOpacity onPress={() => setEditProfile(true)}>
        <KWText style={styles.editLink}>
          Modifier <FontAwesome5 name="edit" size={12} />
        </KWText>
      </TouchableOpacity>

      {/* Bouton de déconnexion */}
      <KWButton
        title="Déconnexion"
        icon="unlink"
        bgColor={colors.red[1]}
        style={styles.logoutBtn}
        onPress={handledisconnect}
      />

      {/* Section Invitations */}
      {invites?.length > 0 && (
        <View style={styles.invitationsContainer}>
          <KWText type="h2">Invitations</KWText>
          <ScrollView>
            {invites.map((invite, i) => (
              <KWCard
                key={i}
                style={styles.inviteCard}
                color={colors.background[0]}
              >
                <KWCardHeader>
                  <KWCardTitle>
                    <KWText>
                      {invite.inviter.firstName} → {invite.invited.firstName}
                    </KWText>
                  </KWCardTitle>
                  <KWCardButton>
                    <View style={styles.infoBull}>
                      <KWText color={getStatusColor(invite.status)}>
                        {getInviteStatus(invite.status)}
                      </KWText>
                    </View>
                  </KWCardButton>
                </KWCardHeader>
              </KWCard>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modal de modification du profil */}
      <KWModal
        visible={editProfile}
        onRequestClose={() => setEditProfile(false)}
      >
        <ProfileEditForm
          member={member}
          onSave={handleSaveProfile}
          onCancel={() => setEditProfile(false)}
        />
      </KWModal>
    </View>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background[0],
  },
  logoutBtn: {
    width: "100%",
    marginTop: 50,
    marginBottom: 30,
  },
  memberTitle: {
    fontSize: 36,
    margin: 10,
    fontWeight: "600",
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    aspectRatio: 1,
    borderRadius: 100,
    margin: 10,
  },
  editLink: {
    color: colors.purple[2],
    fontSize: 16,
    marginBottom: 10,
  },
  invitationsContainer: {
    width: "100%",
  },
  inviteCard: {
    marginTop: 10,
  },
  infoBull: {
    backgroundColor: colors.background[1],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
});
