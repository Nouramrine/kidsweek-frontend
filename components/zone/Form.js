import { View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { colors, userColorSelection } from "../../theme/colors";
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import KWColorPicker from "../KWColorPicker";
import { createZoneAsync, updateZoneAsync } from "../../reducers/zones";
import { useDispatch } from "react-redux";

const ZoneForm = ({ zone, onReturn }) => {
  const dispatch = useDispatch();

  const [nameInput, setNameInput] = useState(zone?.name || '');
  const [selectedColor, setSelectedColor] = useState(zone?.color || userColorSelection[0]);
  const [formErrors, setFormErrors] = useState({});

 

  const formValidation = () => {
    const newErrors = {};
    if (nameInput.length === 0) newErrors.nameInput = "Le nom de la zone est requis";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length > 0 ? false : true;
  }

  const handleSubmit = async () => {
    if(formValidation()) {
      const savedZone = !zone ? dispatch(createZoneAsync({ name: nameInput, color: selectedColor })) : dispatch(updateZoneAsync({ id: zone._id, name: nameInput, color: selectedColor }));
      if (savedZone) {
        setNameInput('');
        onReturn();
      }
    }
  }

  return (
    <View style={styles.container}>
      <KWText type="h1">{ zone ? "Modifier zone" : "Nouvelle zone" }</KWText>
      <ScrollView>
        <KWTextInput
          label="Nom de la zone"
          value={nameInput}
          error={formErrors?.nameInput || null}
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
        <KWButton title={ zone ? "Modifier" : "Ajouter" } bgColor={colors.green[1]} styles={styles.button} onPress={handleSubmit} />
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
