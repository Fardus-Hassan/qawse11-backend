import config from '../config';

const isProd = config.NODE_ENV === 'production';

function formatMessage(level: string, message: string, meta?: unknown) {
  if (isProd) {
    // production: compact JSON
    return JSON.stringify({ level, message, time: new Date().toISOString(), meta });
  }
  // development: readable
  return `${new Date().toISOString()} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.info(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, meta?: unknown) => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message: string, meta?: unknown) => {
    if (!isProd) console.debug(formatMessage('debug', message, meta));
  },
};

export default logger;
