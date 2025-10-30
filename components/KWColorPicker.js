import React from 'react';
import { View, StyleSheet, Pressable, Text } from "react-native";
import { colors } from "../theme/colors";

const KWColorPicker = ({ title, userColorSelection, selectedColor, onColorSelect }) => {
  return (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{title}</Text>
        <View style={styles.inputWrapper}>
            <View style={styles.colorContainer}>
            {userColorSelection.map((userColor, i) => {
            const thisStyle = selectedColor === String(userColor) ? 'selectedColor' : 'color'
            return <Pressable key={i} style={[styles[thisStyle], { backgroundColor: colors[userColor][1] }]} onPress={() => onColorSelect(userColor)} /> 
            })}
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 35,
    flexWrap: 'wrap'
  },
  color: {
    height: 20,
    width: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.text[0]
  },
  selectedColor: {
    height: 30,
    width: 30,
    margin: 5,
    borderWidth: 2,
    borderColor: colors.text[0]
  },
  inputContainer: {
      marginVertical: 10,
      position: 'relative',
  },
  inputLabel: {
      position: 'absolute',
      top: -10,
      left: 15,
      backgroundColor: 'white',
      paddingHorizontal: 5,
      color: "#90CEDD",
      fontWeight: 'bold',
      zIndex: 1,
  },
  inputWrapper: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#90CEDD",
      padding: 10,
  },
});

export default KWColorPicker;