import { View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { colors, userColorSelection } from "../../theme/colors";
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import KWColorPicker from "../KWColorPicker";
import { createZoneAsync } from "../../reducers/zones";
import { useDispatch } from "react-redux";

const ZoneForm = ({ onReturn }) => {
  const dispatch = useDispatch();

  const [nameInput, setNameInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleValidation = async () => {
    const createZone = await dispatch(createZoneAsync({ name: nameInput, color: selectedColor, members: [] })).unwrap();
    if (createZone) {
      setNameInput('');
      onReturn();
    }
  }

  return (
    <View style={styles.container}>
      <KWText type="h1">Nouvelle zone</KWText>
      <ScrollView>
        <KWTextInput
          label="Nom de la zone"
          value={nameInput}
          onChangeText={setNameInput}
        />
        <KWColorPicker 
          title="Couleur de la zone" 
          userColorSelection={userColorSelection} 
          selectedColor={selectedColor || userColorSelection[0] } 
          onColorSelect={(colorName) => setSelectedColor(colorName)} 
        />
      </ScrollView>
      <View style={styles.buttonsFooter}>
        <KWButton title="Annuler" bgColor={colors.red[1]} styles={styles.button} onPress={onReturn} />
        <KWButton title="Nouvelle zone" bgColor={colors.green[1]} styles={styles.button} onPress={handleValidation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonsFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonsSpacer: {
    width: '50%',
    padding: 10,
    backgroundColor: 'grey',
  },
});

export default ZoneForm;
