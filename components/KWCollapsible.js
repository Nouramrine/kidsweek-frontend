// components/KWCollapsible.js
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import Collapsible from "react-native-collapsible";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { KWCard } from "./KWCard";
import KWText from "./KWText";
import { colors } from "../theme/colors";

const KWCollapsible = ({
  title = "Détails",
  icon = "chevron-down",
  children,
  duration = 300,
  defaultCollapsed = true,
  style = {},
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const rotateAnim = useRef(
    new Animated.Value(defaultCollapsed ? 0 : 1)
  ).current;

  // Gérer la rotation de la flèche
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: collapsed ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [collapsed]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <KWCard style={[styles.card, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <KWText type="h3" style={styles.title}>
            {title}
          </KWText>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.text[0] || "#333"}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed} duration={duration}>
        <Animatable.View
          animation={collapsed ? undefined : "fadeInDown"}
          duration={duration}
          style={styles.content}
        >
          {children}
        </Animatable.View>
      </Collapsible>
    </KWCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background[0],
    marginBottom: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: colors.text[1] || "#444",
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
});

export default KWCollapsible;
