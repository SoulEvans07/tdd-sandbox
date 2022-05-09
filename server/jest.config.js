/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/setup-tests.ts'],
  setupFilesAfterEnv: ['./node_modules/jest-extended/all.js', './test/jest-setup.ts', './src/polyfills/jest/index.ts'],
};
