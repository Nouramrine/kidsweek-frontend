import React from "react";
import KWButton from "../KWButton";

const ButtonSaveUpdate = ({
  dateBegin,
  dateEnd,
  handleSave,
  handleUpdate,
  props,
}) => {
  // Si on est en mode "mise à jour"
  console.log("ButtonSaveUpdate props:", props);
  if (props && Object.keys(props).length !== 0) {
    return (
      <KWButton title="Mettre à jour" type="text" onPress={handleUpdate} />
    );
  } else {
    // Sinon, en mode création
    return <KWButton title="Enregistrer" type="text" onPress={handleSave} />;
  }
};

export default ButtonSaveUpdate;
