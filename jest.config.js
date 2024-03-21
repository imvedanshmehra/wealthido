module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(lottie)$': '<rootDir>/jest/__mocks__/lottieMock.js',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'], // Required for some gesture handler setup
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'], // Enable custom matchers for React Native Testing Library
};