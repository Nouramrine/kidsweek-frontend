import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
  KWCardBody,
} from "../KWCard";
import KWText from "../KWText";
import KWButton from "../KWButton";
import KWDropDown from "../KWDropDown";
import MemberCardSimple from "../member/Membercardsimple";
import { colors } from "../../theme/colors";

/**
 * Composant d'affichage d'une zone familiale avec ses membres
 * @param {Object} zone - L'objet zone à afficher
 * @param {Function} onEdit - Callback pour éditer la zone
 * @param {Function} onDelete - Callback pour supprimer la zone
 * @param {Function} onAddMember - Callback pour ajouter un membre à la zone
 * @param {Function} onRemoveMember - Callback pour retirer un membre de la zone
 * @param {String} openDropdownId - ID du dropdown actuellement ouvert
 * @param {Function} setOpenDropdownId - Setter pour l'ID du dropdown ouvert
 */
const ZoneCard = ({
  zone,
  onEdit,
  onDelete,
  onAddMember,
  onRemoveMember,
  openDropdownId,
  setOpenDropdownId,
}) => {
  return (
    <KWCard color={colors[zone.color][0]} style={styles.zoneCard}>
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
                  onEdit(zone);
                }
                if (action === "delete") {
                  onDelete(zone._id);
                  setOpenDropdownId(null);
                }
              }}
            />
          )}
        </KWCardButton>
      </KWCardHeader>

      <KWCardBody>
        {/* Liste des membres de la zone */}
        {zone.members.map((member, j) => (
          <MemberCardSimple
            key={j}
            member={member}
            zoneColor={zone.color}
            showRemoveButton={member.authLevel === "read" && !member.isCurrent}
            onRemove={() => onRemoveMember(zone._id, member._id)}
          />
        ))}

        {/* Bouton d'ajout de membre */}
        <KWButton
          icon="plus"
          title="Ajouter un membre"
          bgColor={colors.background[1]}
          color={colors.text[0]}
          onPress={() => onAddMember(zone)}
          testID="add-member-btn"
        />
      </KWCardBody>
    </KWCard>
  );
};

const styles = StyleSheet.create({
  zoneCard: {
    marginBottom: 20,
  },
});

export default ZoneCard;
