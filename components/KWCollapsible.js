import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KWText from "./KWText";
import { KWCard } from "./KWCard";

const KWCollapsible = ({
  title,
  subtitle,
  children,
  defaultCollapsed = true,
  onToggle,
  paletteDay,
  bgColorActivity,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const rotateAnim = useState(new Animated.Value(collapsed ? 0 : 1))[0];

  const dayPalette = paletteDay || ["#fff", "#ccc", "#000"]; // fallback si paletteDay undefined

  const toggle = () => {
    Animated.timing(rotateAnim, {
      toValue: collapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setCollapsed(!collapsed);
    if (onToggle) onToggle();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={{ marginBottom: 8 }}>
      <KWCard style={{ backgroundColor: bgColorActivity || dayPalette[0] }}>
        <TouchableOpacity
          onPress={toggle}
          style={styles.headerContainer}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            <KWText style={{ fontWeight: "600", color: dayPalette[2] }}>
              {title}
            </KWText>
            {subtitle && <KWText color={dayPalette[2]}>{subtitle}</KWText>}
          </View>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Ionicons
              name="chevron-down-outline"
              size={22}
              color={dayPalette[2]}
            />
          </Animated.View>
        </TouchableOpacity>

        {!collapsed && <View style={styles.body}>{children}</View>}
      </KWCard>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 0,
  },
});

export default KWCollapsible;
