const logger = {
  info: (...args) => console.log('ℹ️ [INFO]', ...args),
  warn: (...args) => console.warn('⚠️ [WARN]', ...args),
  error: (...args) => console.error('❌ [ERROR]', ...args),
  success: (...args) => console.log('✅ [SUCCESS]', ...args)
};

module.exports = logger;

