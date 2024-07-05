// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/mongoMemoryServerSetup.ts'],
  coveragePathIgnorePatterns: ['/tests/', '/src/data/models/'],
};
