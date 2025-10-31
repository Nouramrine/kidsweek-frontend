import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from 'react';
import { colors } from "../../theme/colors";
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import KWCheckbox from "../KWCheckbox";
import { KWCard, KWCardHeader, KWCardIcon, KWCardTitle, KWCardButton } from "../KWCard";
import { fetchMembersAsync } from "../../reducers/members";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome5 } from '@expo/vector-icons';

const MemberAdd = ({ currentMembers, onReturn }) => {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.members.value);

  useEffect(() => {
    dispatch(fetchMembersAsync())
  }, [])

  const handleValidation = async (member) => {
    onReturn(member);
  }

  const currentIds = new Set(currentMembers.map(item => item._id))
  const filteredMembers = members.filter((m) => !currentIds.has(m._id))

  return (
    <ScrollView style={styles.membersContainer}>
    <KWText type='h2'>Ajouter un membre</KWText>
    {!filteredMembers.length && <KWText style={styles.emptyText}>Aucun membre</KWText>}
    {filteredMembers.map((member, j) => {
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
                    {/* <KWText>1000 ans</KWText> */}
                </KWCardTitle>
                <KWCardButton>
                    <KWButton style={styles.addButton} title="Ajouter" onPress={() => handleValidation(member)} />
                </KWCardButton>
            </KWCardHeader>
        </KWCard>
        )
    })} 
    <View style={styles.buttonsFooter}>
        <KWButton title="Retour" bgColor={colors.red[1]} styles={styles.button} onPress={onReturn} />
    </View>         
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  membersContainer: {
    width: '100%',
  },
  memberCard: {
    marginTop: 10,
    padding: 10,
  },
  emptyText: {
    padding: 25,
    width: '100%',
    textAlign: 'center',
  },
  addButton: {
    marginTop: -1,
  },
  returnButton: {
    width: '100%',
    alignItems: 'flex-end',
  },
});

export default MemberAdd;
