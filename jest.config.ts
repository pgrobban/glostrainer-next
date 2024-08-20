import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\",
    "/node_modules/",
    "\\\\data\\\\",
    "/data/",
    "\\\\mocks\\\\",
    "/mocks/",
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ["jest-canvas-mock"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
};

export default createJestConfig(config);
