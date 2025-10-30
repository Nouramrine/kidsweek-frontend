import React, { useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const KWCheckbox = ({ label, value, onValueChange }) => {
  const [width, setWidth] = useState(0);
  const position = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(position, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggle = () => {
    onValueChange(!value);
  };

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2], // la moitié du conteneur
  });

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={toggle} activeOpacity={0.9}>
        <View
          style={styles.toggleWrapper}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[
              styles.slider,
              {
                width: width / 2, // largeur dynamique du slider
                transform: [{ translateX }],
              },
            ]}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, !value && styles.activeText]}>Parent</Text>
            <Text style={[styles.text, value && styles.activeText]}>Enfant</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: 'relative',
    width: '100%', // ← s’adapte au parent
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    color: '#90CEDD',
    fontWeight: 'bold',
    zIndex: 1,
  },
  toggleWrapper: {
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#90CEDD',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#90CEDD',
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  text: {
    color: '#90CEDD',
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
  },
});

export default KWCheckbox;
