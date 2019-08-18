const {
    defaults
} = require('jest-config');


module.exports = {
    "testRegex": ".*\\.spec\\.test\\.tsx?$",
    "verbose": false,
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "coverageReporters": ["json", "lcov", "text", "html"],
    "coverageThreshold": {
        "global": {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": -50
        }
    }
}