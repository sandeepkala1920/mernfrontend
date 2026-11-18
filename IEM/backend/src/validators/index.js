const { GMAIL_REGEX, validateRegister, validateLogin } = require('./authValidator');
const { validateProfileUpdate } = require('./applicantValidator');
const { validatePaymentRequest } = require('./paymentValidator');

module.exports = {
  GMAIL_REGEX,
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePaymentRequest
};

