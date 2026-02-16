import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import KWText from "../KWText";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

const HomeHeader = ({ notificationCount, onBellPress }) => {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/titre.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={onBellPress} style={styles.bellContainer}>
        <FontAwesome5 name="bell" size={28} color={colors.purple[1]} solid />
        {notificationCount.length > 0 && (
          <View style={styles.badge}>
            <KWText style={styles.badgeText}>{notificationCount}</KWText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: { width: "60%", aspectRatio: 3 },
  bellContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  badge: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: -6,
    right: -6,
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: colors.orange[0],
  },
  badgeText: { color: colors.text[0], fontSize: 12, fontWeight: "bold" },
});

export default HomeHeader;
