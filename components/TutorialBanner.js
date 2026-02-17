import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KWText from "./KWText";
import KWButton from "./KWButton";
import { colors } from "../theme/colors";

const TutorialBanner = ({
  id,
  message,
  ctaLabel,
  onCta,
  onDismiss,
  visible = false,
  bgColor = colors.purple[0],
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="bulb" size={24} color={colors.purple[2]} />
      </View>

      <View style={styles.content}>
        <KWText style={styles.message}>{message}</KWText>

        <View style={styles.actions}>
          <KWButton
            title={ctaLabel}
            bgColor={colors.purple[1]}
            color="white"
            onPress={onCta}
            style={styles.ctaButton}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onDismiss}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={20} color={colors.purple[2]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    color: colors.text[0],
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaButton: {
    minWidth: 120,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default TutorialBanner;
