import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
} from "../KWCard";
import KWText from "../KWText";
import { colors } from "../../theme/colors";

const MemberCardSimple = ({
  member,
  zoneColor = null,
  showRemoveButton = false,
  onRemove,
}) => {
  // Déterminer la couleur de fond de l'icône
  const iconBgColor = zoneColor ? colors[zoneColor][2] : "#d4d4d4ff";

  // Déterminer la couleur de fond de la carte
  const cardColor = member.color
    ? colors[member.color][0]
    : colors.background[1];

  return (
    <KWCard color={cardColor} style={styles.memberCard}>
      <KWCardHeader>
        <KWCardIcon>
          <View
            style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
          >
            <FontAwesome5 name="user" size={24} color="white" />
          </View>
        </KWCardIcon>

        <KWCardTitle>
          <KWText>{member.firstName}</KWText>
        </KWCardTitle>

        <KWCardButton>
          {/* Badge de rôle */}
          <View style={styles.badge}>
            {member.isChildren ? (
              <KWText color={colors.blue[1]}>Enfant</KWText>
            ) : (
              <KWText color={colors.red[1]}>
                {member.authLevel === "admin" ? "Propriétaire" : "Parent"}
              </KWText>
            )}
          </View>

          {/* Bouton de retrait (si applicable) */}
          {showRemoveButton && (
            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
              <FontAwesome5 name="minus" size={13} color="white" />
            </TouchableOpacity>
          )}
        </KWCardButton>
      </KWCardHeader>
    </KWCard>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    marginTop: 10,
    padding: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
  },
  badge: {
    backgroundColor: colors.background[1],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  removeBtn: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: colors.error[0],
  },
});

export default MemberCardSimple;
