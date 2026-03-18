const otpRegex = /\b\d{4,8}\b/;

function hasOtp(message) {
  return otpRegex.test(message);
}

module.exports = { hasOtp };
