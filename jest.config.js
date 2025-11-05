module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-safe-area-context)/)"
  ],
  // Utiliser babel-jest pour tout JS/TS
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
};
