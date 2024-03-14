const otpGenerator = require("otp-generator");

const username_validator = (username) => {
  return /^(?=(?:[^a-zA-Z]*[a-zA-Z]){5})[a-zA-Z0-9_]{1,20}$/.test(username);
};

const email_validator = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const generateOTP = () => {
  return otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

module.exports = { username_validator, email_validator, generateOTP };
