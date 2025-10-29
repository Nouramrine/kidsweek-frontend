import React from "react";
import KWButton from "../KWButton";

const ButtonSaveUpdate = ({
  dateBegin,
  dateEnd,
  handleSave,
  handleUpdate,
  activityToEdit,
}) => {
  // Si les dates sont invalides
  if (dateEnd < dateBegin) {
    return (
      <KWButton
        title="* Erreur sur le formulaire"
        type="inputError"
        style={{ backgroundColor: "transparent" }}
      />
    );
  }

  // Si on est en mode "mise à jour"
  if (activityToEdit !== null) {
    return (
      <KWButton title="Mettre à jour" type="text" onPress={handleUpdate} />
    );
  }

  // Sinon, en mode création
  return <KWButton title="Enregistrer" type="text" onPress={handleSave} />;
};

export default ButtonSaveUpdate;
