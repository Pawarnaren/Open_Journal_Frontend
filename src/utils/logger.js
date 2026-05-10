// ─────────────────────────────────────────────────────────────────────────────
// utils/logger.js
// Centralised structured logger.
// Format: [ISO-TIMESTAMP] [LEVEL] [ModuleName] Message
// Respects VITE_LOG_LEVEL env var (debug | info | warn | error).
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const configuredLevel = (import.meta.env.VITE_LOG_LEVEL || 'info').toLowerCase();
const configuredLevelNum = LEVELS[configuredLevel] ?? LEVELS.info;

const shouldLog = (level) => (LEVELS[level] ?? 0) >= configuredLevelNum;

const timestamp = () => new Date().toISOString();

const formatMessage = (level, module, ...args) =>
  [`[${timestamp()}] [${level.toUpperCase()}] [${module}]`, ...args];

const logger = {
  debug: (module, ...args) => {
    if (shouldLog('debug')) console.debug(...formatMessage('debug', module, ...args));
  },
  info: (module, ...args) => {
    if (shouldLog('info')) console.info(...formatMessage('info', module, ...args));
  },
  log: (module, ...args) => {
    if (shouldLog('info')) console.log(...formatMessage('info', module, ...args));
  },
  warn: (module, ...args) => {
    if (shouldLog('warn')) console.warn(...formatMessage('warn', module, ...args));
  },
  error: (module, ...args) => {
    if (shouldLog('error')) console.error(...formatMessage('error', module, ...args));
  },
};

export default logger;
