export default {
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ]
}