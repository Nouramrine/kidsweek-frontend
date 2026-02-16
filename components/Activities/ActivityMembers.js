import { View, TouchableOpacity, StyleSheet } from "react-native";
import KWText from "../KWText";
import KWButton from "../KWButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function ActivityMembers({ members, onRemove, onOpenModal }) {
  return (
    <View style={styles.section}>
      <KWText style={styles.label}>Qui participera ?</KWText>

      {members.length > 0 ? (
        members.map((member) => {
          const colorKey = member.color || "skin";
          const memberColor = colors[colorKey] || colors.skin;

          return (
            <View
              key={member._id}
              style={[
                styles.memberItem,
                {
                  backgroundColor: memberColor[0],
                  borderColor: memberColor[1],
                },
              ]}
            >
              <KWText>{member.firstName}</KWText>

              <TouchableOpacity onPress={() => onRemove(member._id)}>
                <FontAwesome5 name="times" size={18} color={colors.red[1]} />
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <KWText style={styles.empty}>Aucun membre sélectionné.</KWText>
      )}

      <KWButton
        icon="plus"
        title="Ajouter un membre"
        bgColor={colors.background[1]}
        color={colors.text[0]}
        onPress={onOpenModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  label: { marginBottom: 10, fontWeight: "600" },
  empty: { fontStyle: "italic", textAlign: "center", color: "#9ca3af" },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
  },
});
