import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

const KWDropdown = ({ selectedValue, onValueChange, style }) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={[styles.picker, style]}
      dropdownIconColor={colors.text[0]}
      mode="dropdown"
    >
      <Picker.Item label="minutes" value="minutes" color={colors.text[0]} />
      <Picker.Item label="heures" value="heures" color={colors.text[0]} />
      <Picker.Item label="jours" value="jours" color={colors.text[0]} />
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    color: colors.text[0],
  },
});

export default KWDropdown;
