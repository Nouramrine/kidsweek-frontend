import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { colors } from "../theme/colors";
import { logout } from "../reducers/user";
import KWButton from "../components/KWButton";
import { FontAwesome5 } from "@expo/vector-icons";
import KWText from "../components/KWText";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
  KWCardBody,
} from "../components/KWCard";
import { fetchInvitesAsync } from "../reducers/invites";

const ProfilScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);
  const invites = useSelector((state) => state.invites.value);

  const member = members.filter((m) => m.token === user.token )[0];

  const [editProfile, setEditProfile] = useState(false);

  //console.log(member)
  //console.log(invites)

  useEffect(() => {
    dispatch(fetchInvitesAsync())
  }, [])


  const handledisconnect = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}><FontAwesome5 name="user" size={100} color="white" /></View>
      <KWText style={styles.memberTitle}>{member.firstName} {member.lastName}</KWText>
      <KWText style={styles.editLink} onPress={() => setEditProfile(true)}>Modifier <FontAwesome5 name="edit" size={12} /></KWText>
      <KWButton title="Deconnexion" icon="unlink" bgColor={colors.red[1]} style={styles.logoutBtn} onPress={() => handledisconnect()} />
      {invites?.length > 0 && 
        <View style={styles.invitationsContainer}>
          <KWText type="h2">Invitations</KWText>
          <ScrollView>
            {invites.map((invite, i) => {
              const inviteStatus = () => {
                switch (invite.status) {
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
              }
              return (
                <KWCard key={i} style={styles.inviteCard} color={colors.background[0]}>
                  <KWCardHeader>
                    <KWCardTitle>
                      <KWText>{invite.inviter.firstName} &gt; {invite.invited.firstName} </KWText>
                    </KWCardTitle>
                    <KWCardButton>
                      <View style={styles.infoBull}>
                        <KWText color={colors.red[1]}>
                          {inviteStatus()}
                        </KWText>
                      </View>
                      {/* <TouchableOpacity
                        style={styles.iconBtn}
                      >
                        <FontAwesome5
                          name="minus"
                          size={13}
                          color="white"
                        />
                      </TouchableOpacity> */}
                    </KWCardButton>
                  </KWCardHeader>
                </KWCard>
              )
            })}
          </ScrollView>
        </View>
      }
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
  },
  logoutBtn: {
    width: '100%',
    marginTop: 50,
    marginBottom: 30,
  },
  memberTitle: {
    fontSize: 36,
    margin: 10,
  }, 
  avatar: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 200, 
    aspectRatio: 1, 
    backgroundColor: "#aaaaaaff", 
    borderRadius: 100, 
    margin: 10 
  },
  invitationsContainer: {
    width: '100%',
  },
  iconBtn: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: colors.error[0],
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
