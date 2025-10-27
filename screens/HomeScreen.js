import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <View style={styles.container}>
      <Text>Homepage</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});