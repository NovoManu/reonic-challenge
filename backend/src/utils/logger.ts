import { LOG_CONFIG } from './config';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

const currentLogLevel = (LOG_CONFIG.LEVEL as LogLevel) || LogLevel.INFO;

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[currentLogLevel];
};

const formatLogMessage = (level: LogLevel, message: string, meta?: Record<string, any>): string => {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (meta) {
    formattedMessage += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return formattedMessage;
};

export const logger = {
  debug: (message: string, meta?: Record<string, any>): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatLogMessage(LogLevel.DEBUG, message, meta));
    }
  },
  
  info: (message: string, meta?: Record<string, any>): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatLogMessage(LogLevel.INFO, message, meta));
    }
  },
  
  warn: (message: string, meta?: Record<string, any>): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatLogMessage(LogLevel.WARN, message, meta));
    }
  },
  
  error: (message: string, error?: Error, meta?: Record<string, any>): void => {
    if (shouldLog(LogLevel.ERROR)) {
      const errorMeta = error ? {
        ...meta,
        errorMessage: error.message,
        stack: error.stack,
      } : meta;
      
      console.error(formatLogMessage(LogLevel.ERROR, message, errorMeta));
    }
  },
};
