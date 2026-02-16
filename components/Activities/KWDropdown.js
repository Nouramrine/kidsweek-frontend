import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

const KWDropdown = ({ selectedValue, onValueChange, style }) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={[styles.picker, style]}
    >
      <Picker.Item label="minutes" value="minutes" />
      <Picker.Item label="heures" value="heures" />
      <Picker.Item label="jours" value="jours" />
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
  },
});

export default KWDropdown;
