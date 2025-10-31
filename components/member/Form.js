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
  const [email, setEmail] = useState(data?.member?.email || '');
  const [color, setColor] = useState(data?.member?.color || 'skin');
  const [isChildren, setIsChildren] = useState(data?.member?.isChildren || false);
  
  const handleValidation = async () => {
    if (!data?.member) {
        const createMember = dispatch(
          createMemberAsync({ firstName, lastName, color, isChildren })
        );
        if (createMember) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setIsChildren(false);
          onReturn();
        }
    } else {
      const updateData = { id: data.member._id, firstName, lastName, color, isChildren };
      const updateMember = dispatch(updateMemberAsync(updateData));
      if (updateMember) {
        setFirstName('');
        setLastName('');
        setEmail('');
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
          onChangeText={setFirstName}
        />
        <KWTextInput
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
        />
        <KWTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
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
        <KWButton title={ data?.member ? "Modifier" : "Ajouter" } bgColor={colors.green[1]} styles={styles.button} onPress={handleValidation} />
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
