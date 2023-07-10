import { allowedOrigins } from './allowedOrigins.js';
import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('cors error'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
