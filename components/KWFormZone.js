import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const KWZoneForm = ({ onReturn }) => {

  return (
    <Text style={styles.text}>
      Coucou, la form ?
    </Text>
  );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: 'JosefinSans_400Regular',
    }
});

export default KWZoneForm;
