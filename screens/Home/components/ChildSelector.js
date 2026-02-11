import React from "react";
import { View } from "react-native";
import KWButton from "../../../components/KWButton";
import KWText from "../../../components/KWText";
import { colors } from "../../../theme/colors";

const ChildSelector = ({ childrenList, selectedChild, onSelect }) => {
  if (!childrenList || childrenList.length === 0) {
    return <KWText>Aucun enfant enregistré.</KWText>;
  }

  const moiPalette = colors.purple;
  const isMoiSelected = !selectedChild;

  return (
    <View style={{ flexDirection: "row" }}>
      <KWButton
        title="Moi"
        bgColor={isMoiSelected ? "white" : moiPalette[0]}
        color={moiPalette[2]}
        onPress={() => onSelect(null)}
        style={{
          borderWidth: 1,
          borderColor: moiPalette[2],
          padding: 5,
          paddingHorizontal: 15,
          marginRight: 5,
        }}
      />

      {childrenList.map((child) => {
        const palette = colors[child.color] || colors.purple;
        const isSelected = selectedChild?._id === child._id;

        return (
          <KWButton
            key={child._id}
            title={child.firstName}
            bgColor={isSelected ? "white" : palette[0]}
            color={isSelected ? palette[2] : palette[2]}
            onPress={() => onSelect(isSelected ? null : child)}
            style={{
              borderWidth: 1,
              borderColor: palette[2],
              padding: 5,
              paddingHorizontal: 15,
              marginRight: 5,
            }}
          />
        );
      })}
    </View>
  );
};

export default ChildSelector;
