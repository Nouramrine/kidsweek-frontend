import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react";
import { colors } from "../../theme/colors";
import KWText from "../KWText";
import KWButton from "../KWButton";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
} from "../KWCard";
import { fetchMembersAsync } from "../../reducers/members";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";

const MemberAdd = ({ currentMembers, onReturn }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.value) || [];
  console.log("Current members:", currentMembers);

  useEffect(() => {
    dispatch(fetchMembersAsync());
  }, []);

  const handleValidation = async (member) => {
    onReturn(member);
  };

  const currentIds = new Set(
    (Array.isArray(currentMembers) ? currentMembers : []).map(
      (item) => item._id
    )
  );

  const filteredMembers = Array.isArray(members)
    ? members.filter((m) => !currentIds.has(m._id))
    : [];

  return (
    <ScrollView style={styles.membersContainer}>
      <KWText type="h2">Ajouter un membre</KWText>
      {Array.isArray(filteredMembers) && filteredMembers.length > 0 ? (
        filteredMembers.map((member, j) => {
          return (
            <KWCard
              key={member._id || j}
              color={
                colors[member.color] ? colors[member.color][0] : colors.skin[0]
              }
              style={styles.memberCard}
            >
              <KWCardHeader>
                <KWCardIcon>
                  <View
                    style={{
                      backgroundColor: "#dddddd",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <FontAwesome5 name="user" size={24} color="white" />
                  </View>
                </KWCardIcon>
                <KWCardTitle>
                  <KWText>{member.firstName}</KWText>
                </KWCardTitle>
                <KWCardButton>
                  <KWButton
                    style={styles.addButton}
                    title="Ajouter"
                    bgColor={colors.green[1]}
                    onPress={() => handleValidation(member)}
                  />
                </KWCardButton>
              </KWCardHeader>
            </KWCard>
          );
        })
      ) : (
        <KWText style={styles.emptyText}>Aucun membre à ajouter</KWText>
      )}
      <View style={styles.buttonsFooter}>
        <KWButton
          title="Retour"
          bgColor={colors.red[1]}
          style={styles.button}
          onPress={() => onReturn()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  membersContainer: {
    width: "100%",
  },
  memberCard: {
    marginTop: 10,
    padding: 10,
  },
  emptyText: {
    padding: 25,
    width: "100%",
    textAlign: "center",
  },
  addButton: {
    marginTop: -1,
  },
  button: {
    marginTop: 10,
  },
});

export default MemberAdd;
