import { View, StyleSheet, ScrollView } from "react-native";
import { useState } from 'react';
import { colors, userColorSelection } from "../../theme/colors";
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import KWCheckbox from "../KWCheckbox";
import KWColorPicker from "../KWColorPicker";
import { createMemberAsync, updateMemberAsync } from "../../reducers/members";
import { useDispatch } from "react-redux";

const MemberForm = ({ data, onReturn }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(data?.member?.firstName || '');
  const [lastName, setLastName] = useState(data?.member?.lastName || '');
  const [color, setColor] = useState(data?.member?.color || 'skin');
  const [isChildren, setIsChildren] = useState(data?.member?.isChildren || false);
  const [formErrors, setFormErrors] = useState({});

  const formValidation = () => {
    const newErrors = {};
    if (firstName.length === 0) newErrors.firstName = "Le prénom est requis";
    if (lastName.length === 0) newErrors.lastName = "Le nom est requis";
    //if (!email.includes("@") && !email.includes(".")) newErrors.email = "Invalid email address";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length > 0 ? false : true;
  }
  
  const handleSubmit = async () => {
    if(formValidation()) {
      const savedMember = !data?.member ? dispatch(createMemberAsync({ firstName, lastName, color, isChildren })) : dispatch(updateMemberAsync({ id: data.member._id, firstName, lastName, color, isChildren }));
      if(savedMember) {
        setFirstName('');
        setLastName('');
        setIsChildren(false);
        onReturn();
      }
    }
  }

  return (
    <View style={styles.container}>
      <KWText type="h1">{ data?.member ? "Modifier membre" : "Nouveau membre" }</KWText>
      <ScrollView>
        <KWTextInput
          label="Prénom"
          value={firstName}
          error={formErrors?.firstName || null}
          onChangeText={setFirstName}
        />
        <KWTextInput
          label="Nom"
          value={lastName}
          error={formErrors?.lastName || null}
          onChangeText={setLastName}
        />
        <KWColorPicker 
          title="Couleur" 
          userColorSelection={userColorSelection} 
          selectedColor={color} 
          onColorSelect={(colorName) => setColor(colorName)} 
        />
        <KWCheckbox
          value={isChildren}
          onValueChange={setIsChildren}
        />
      </ScrollView>
      <View style={styles.buttonsFooter}>
        <KWButton title="Annuler" bgColor={colors.red[1]} styles={styles.button} onPress={onReturn} />
        <KWButton title={ data?.member ? "Modifier" : "Ajouter" } bgColor={colors.green[1]} styles={styles.button} onPress={handleSubmit} />
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
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default MemberForm;
