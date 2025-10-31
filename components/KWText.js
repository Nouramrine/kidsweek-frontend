import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const KWText = ({ children, ...props }) => {
  const type = props?.type || "text";
  const color = props?.color || "text";
  return (
    <Text style={[styles.text, styles[type], { color: color }, props.style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "JosefinSans_400Regular",
  },
  h1: {
    fontSize: 22,
    fontFamily: "Gluten_500Medium",
    textAlign: "center",
    padding: 10,
  },
  h2: {
    fontSize: 18,
    fontFamily: "Gluten_500Medium",
    textAlign: "left",
    padding: 10,
  },
  h3: {},
  inputError: {
    color: colors.error[0],
    paddingBottom: 10,
    paddingHorizontal: 15,
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default KWText;
