import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KWText from './KWText';

const KWDropDown = ({ id, icon, options, openId, setOpenId, onSelect }) => {
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    if (openId === id) {
      setOpenId(null);
    } else if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPos({ bottom: -height, right: width + 5 });
        setOpenId(id);
      });
    }
  };

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
  };

  const visible = openId === id;

  return (
    <View style={styles.container}>
      <TouchableOpacity ref={buttonRef} style={styles.button} onPress={toggleDropdown}>
        {icon && <FontAwesome5 name={icon} size={14} color={colors.text[0]} />}
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, { top: dropdownPos.bottom, right: dropdownPos.right, position: 'absolute' }]}>
          {options.map((item, j) => (
            <TouchableOpacity key={j} style={styles.item} onPress={() => handleSelect(item.action)}>
              <KWText style={[styles.optionText, item.color && { color: item.color }]}>{item.label}</KWText>
              {item.icon && <FontAwesome5 style={[styles.optionIcon, item.color && { color: item.color }]} name={item.icon} size={14} color={colors.text[0]} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    padding: 10,
    aspectRatio: 1,
    backgroundColor: colors.background[1],
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 5,
    width: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingHorizontal: 15 },
});

export default KWDropDown;
