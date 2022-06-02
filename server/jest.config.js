/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageReporters: ['json', 'html'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [],
  setupFilesAfterEnv: ['./node_modules/jest-extended/all.js', './src/setupTests.ts', './src/polyfills/jest/index.ts'],
};
