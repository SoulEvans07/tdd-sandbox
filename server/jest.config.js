/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageReporters: ['json', 'html'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [],
  setupFilesAfterEnv: ['jest-extended/all.js', 'jest-polyfill', './src/setupTests.ts'],
};
