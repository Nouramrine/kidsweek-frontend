import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import KWText from "../KWText";
import { colors } from "../../theme/colors";

/**
 * Liste d'icônes disponibles pour les avatars
 */
const AVATAR_ICONS = [
  "user",
  "user-circle",
  "user-astronaut",
  "user-ninja",
  "user-tie",
  "user-graduate",
  "baby",
  "child",
  "user-md",
  "user-nurse",
  "user-secret",
  "hat-wizard",
  "robot",
  "cat",
  "dog",
  "dragon",
  "fish",
  "kiwi-bird",
  "otter",
  "hippo",
  "horse",
  "frog",
  "smile",
  "laugh",
  "grin",
  "star",
  "heart",
  "crown",
  "chess-king",
  "chess-queen",
];

/**
 * Composant de sélection d'avatar
 * @param {String} selectedIcon - Icône actuellement sélectionnée
 * @param {Function} onSelect - Callback lors de la sélection d'une icône
 */
const AvatarPicker = ({ selectedIcon = "user", onSelect }) => {
  return (
    <View style={styles.container}>
      <KWText type="h3" style={styles.title}>
        Choisir un avatar
      </KWText>
      <ScrollView contentContainerStyle={styles.grid}>
        {AVATAR_ICONS.map((icon) => {
          const isSelected = icon === selectedIcon;
          return (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconButton,
                isSelected && styles.iconButtonSelected,
              ]}
              onPress={() => onSelect(icon)}
            >
              <FontAwesome5
                name={icon}
                size={30}
                color={isSelected ? colors.purple[2] : colors.text[0]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background[1],
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconButtonSelected: {
    backgroundColor: colors.purple[0],
    borderColor: colors.purple[2],
  },
});

export default AvatarPicker;
