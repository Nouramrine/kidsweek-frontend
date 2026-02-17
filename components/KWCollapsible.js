import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
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
  rightHeader,
}) => {
  // Animation hauteur et opacité du contenu
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // Animation de rotation du chevron
  const rotation = useRef(new Animated.Value(0)).current;

  // Animation du borderRadius du header
  const headerRadius = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerRadius, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerRadius, {
          toValue: 12,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isExpanded]);

  // Interpolation du chevron (rotation de 0° à 180°)
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Interpolation hauteur max (0 → 500px arbitraire, ajustable)
  const maxHeightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1500],
  });

  return (
    <View style={styles.wrapper}>
      {/* HEADER - toujours visible avec fond coloré */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: palette[0],
            borderBottomLeftRadius: headerRadius,
            borderBottomRightRadius: headerRadius,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerTouchable}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            <KWText type="h3" style={{ color: "black" }}>
              {title}
            </KWText>
            {subtitle && (
              <KWText style={{ color: "black", fontSize: 13 }}>
                {subtitle}
              </KWText>
            )}
          </View>
          {/*ajout des % tasks*/}
          {rightHeader && <View style={styles.rightHeader}>{rightHeader}</View>}
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons name="chevron-down" size={22} color={palette[2]} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* CONTENU - s'anime avec maxHeight */}
      <Animated.View
        style={[
          styles.expandableSection,
          {
            backgroundColor: palette[0],
            maxHeight: maxHeightInterpolate,
            opacity: animatedOpacity,
          },
        ]}
      >
        <View style={[styles.body, { backgroundColor: palette[1] + "33" }]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  expandableSection: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 20,
  },
  body: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  rightHeader: {
    marginLeft: 10,
  },
});

export default KWCollapsible;
