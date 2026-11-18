const validatePaymentRequest = (data) => {
  const mode = data.mode || 'Net Banking / UPI';
  return { valid: true, mode };
};

module.exports = { validatePaymentRequest };

