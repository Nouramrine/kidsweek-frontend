import { View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { colors, userColorSelection } from "../../theme/colors";
import * as Sharing from "expo-sharing";
import QRCode from 'react-native-qrcode-svg';
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import { useDispatch } from "react-redux";
import { createInviteAsync } from "../../reducers/invites";

const ZoneForm = ({ data, onReturn }) => {
  const dispatch = useDispatch();

  const [emailInput, setEmailInput] = useState('jeremy.guerlin@gmail.com');
  const [formErrors, setFormErrors] = useState({});
  const [inviteToken, setInviteToken] = useState(null);

  const formValidation = () => {
    const newErrors = {};
    if (!emailInput.includes('@')) newErrors.emailInput = `Format email incorrect, "@" manquant`;
    if (!emailInput.includes('.')) newErrors.emailInput = `Format email incorrect, "." manquant`;
    setFormErrors(newErrors);
    return Object.keys(newErrors).length > 0 ? false : true;
  }

  const handleSubmit = async () => {
    if(formValidation()) {
        const emailData = { invitedId: data?.member._id, emailAddress: emailInput };
        const sendMail = await dispatch(createInviteAsync(emailData)).unwrap()
        if(sendMail) {
          setInviteToken(sendMail.token)
          //onReturn();
        } else {
          setFormErrors({ emailInput: `Echec d'envoi du mail d'invitation` });
        } 
    }
  }

  const handleSharing = async () => {
    await Sharing.shareAsync(token);
  }

  if(!inviteToken) {
    return (
      <View style={styles.container}>
        <KWText type="h1">Inviter un proche</KWText>
        <ScrollView>
          <KWTextInput
            label="Email"
            value={emailInput}
            error={formErrors?.emailInput || null}
            onChangeText={setEmailInput}
          />
        </ScrollView>
        <View style={styles.buttonsFooter}>
          <KWButton title="Annuler" bgColor={colors.red[1]} styles={styles.button} onPress={onReturn} />
          <KWButton title="Inviter" bgColor={colors.green[1]} styles={styles.button} onPress={handleSubmit} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <KWText type="h1">Inivtation envoyée</KWText>
        <KWText>Une invitation a été envoyée par email à l'adresse {emailInput}.</KWText>
        {/* <KWText>Vous pouvez également partager cette invitation via vos réseaux sociaux <KWButton title="Partager" icon="share" onPress={() => handleSharing()} /></KWText> */}
        <KWText style={{ width: '100%', textAlign: 'center', padding: 20, fontWeight: 'bold' }}>ou</KWText>
        <KWText>Scannez ce QR code sur la page d'inscription pour lier le compte</KWText>
        <View style={styles.qrContainer}>
          <QRCode value={inviteToken} size={200} />
        </View>
        <View style={styles.buttonsFooter}>
          <KWButton title="Retour" bgColor={colors.red[1]} styles={styles.button} onPress={onReturn} />
        </View>
      </View>
    ); 
  } 
}

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
  qrContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ZoneForm;
