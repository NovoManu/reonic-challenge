export const SERVER_CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const CORS_CONFIG = {
  ORIGINS: process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',') : 
    ['http://localhost:8080'],
  CREDENTIALS: true,
};

export const SIMULATION_DEFAULTS = {
  ARRIVAL_PROBABILITY_MULT: 100,
  CAR_CONSUMPTION: 18,
  CHARGING_POWER: 11,
};

export const DB_CONFIG = {
  CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT ? 
    parseInt(process.env.DB_CONNECTION_LIMIT, 10) : 
    10,
};

export const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
};
