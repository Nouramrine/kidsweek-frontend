import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import KWText from "../KWText";
import KWTextInput from "../KWTextInput";
import KWButton from "../KWButton";
import KWColorPicker from "../KWColorPicker";
import AvatarPicker from "./AvatarPicker";
import { colors, userColorSelection } from "../../theme/colors";

/**
 * Formulaire de modification du profil utilisateur
 * @param {Object} member - Objet membre contenant les données actuelles
 * @param {Function} onSave - Callback lors de la sauvegarde
 * @param {Function} onCancel - Callback lors de l'annulation
 */
const ProfileEditForm = ({ member, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(member?.firstName || "");
  const [lastName, setLastName] = useState(member?.lastName || "");
  const [avatarIcon, setAvatarIcon] = useState(member?.avatar || "user");
  const [selectedColor, setSelectedColor] = useState(
    member?.color || userColorSelection[0],
  );
  const [formErrors, setFormErrors] = useState({});

  const formValidation = () => {
    const newErrors = {};
    if (firstName.trim().length === 0) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (lastName.trim().length === 0) {
      newErrors.lastName = "Le nom est requis";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (formValidation()) {
      onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar: avatarIcon,
        color: selectedColor,
      });
    }
  };

  return (
    <View style={styles.container}>
      <KWText type="h1" style={styles.title}>
        Modifier mon profil
      </KWText>

      <ScrollView style={styles.scrollView}>
        {/* Aperçu de l'avatar */}
        <View style={styles.avatarPreview}>
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: colors[selectedColor]?.[1] || colors.purple[1],
              },
            ]}
          >
            <FontAwesome5 name={avatarIcon} size={80} color="white" />
          </View>
        </View>

        {/* Sélecteur d'avatar */}
        <AvatarPicker selectedIcon={avatarIcon} onSelect={setAvatarIcon} />

        {/* Champs de formulaire */}
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

        {/* Sélecteur de couleur */}
        <KWColorPicker
          title="Couleur"
          userColorSelection={userColorSelection}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </ScrollView>

      {/* Boutons d'action */}
      <View style={styles.buttonsFooter}>
        <KWButton
          title="Annuler"
          bgColor={colors.red[1]}
          style={styles.button}
          onPress={onCancel}
        />
        <KWButton
          title="Enregistrer"
          bgColor={colors.green[1]}
          style={styles.button}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: "90%",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 500,
  },
  avatarPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    backgroundColor: colors.purple[1],
    borderRadius: 75,
    marginVertical: 10,
  },
  buttonsFooter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

export default ProfileEditForm;
