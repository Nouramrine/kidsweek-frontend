import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KWText from "./KWText";

const KWCollapsible = ({
  title,
  subtitle,
  children,
  palette,
  isExpanded,
  onToggle,
}) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  return (
    <View style={[styles.container, { backgroundColor: palette[0] }]}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <View style={{ flex: 1 }}>
          <KWText type="h3" style={{ color: palette[2] }}>
            {title}
          </KWText>
          {subtitle && (
            <KWText style={{ color: palette[2], fontSize: 13 }}>
              {subtitle}
            </KWText>
          )}
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={palette[2]}
        />
      </TouchableOpacity>

      {isExpanded && <View style={styles.body}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 10,
  },
});

export default KWCollapsible;
