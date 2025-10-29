import { Picker } from "@react-native-picker/picker";

const KWDropdown = ({ selectedValue, onValueChange }) => {
  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      <Picker.Item label="minutes" value="minutes" />
      <Picker.Item label="heures" value="heures" />
      <Picker.Item label="jours" value="jours" />
    </Picker>
  );
};

export default KWDropdown;
