const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  moduleFileExtensions: ['jsx', 'js', 'json', 'node'], // Read from left to right

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  testPathIgnorePatterns: ['/node_modules/', '/public/'],

  // setupFiles before the tests are ran, but after jest is mounted into the env
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js', '@testing-library/react/cleanup-after-each'],

  // To mock our css and other static assets
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
