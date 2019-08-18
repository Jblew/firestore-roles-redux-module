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
}