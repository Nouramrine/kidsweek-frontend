module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|react-native-vector-icons|@expo|expo)"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
