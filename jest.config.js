module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '@components/(.*)$': '<rootDir>/src/components/$1',
    '@context/(.*)$': '<rootDir>/src/context/$1',
    '@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '@screens/(.*)$': '<rootDir>/src/screens/$1',
    '@services/(.*)$': '<rootDir>/src/services/$1',
    '@styles/(.*)$': '<rootDir>/src/styles/$1',
    '@utils/(.*)$': '<rootDir>/src/utils/$1',
    '@assets/(.*)$': '<rootDir>/assets/$1',
  },
};

console.log('jest.config.js');
