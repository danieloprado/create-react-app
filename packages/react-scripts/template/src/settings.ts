export const ENV = (process.env.REACT_APP_ENV || 'production').trim();

export const API_TIMEOUT = Number(process.env.REACT_APP_API_TIMEOUT) || 0;
export const API_ENDPOINT = (process.env.REACT_APP_API_ENDPOINT || '').trim();
if (!API_ENDPOINT) throw new Error('Please provide an API_ENDPOINT');

export const SENTRY_KEY = (process.env.REACT_APP_SENTRY_KEY ||
  'https://0acf5f2525254b72bd783b1031da9d4e@sentry.io/298690').trim();

export const isDevelopment = ENV === 'development';