import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import root from './routes/root.js';
import { logger, logEvents } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { __dirname } from './global/variables.js';
import { corsOptions } from './config/corsOptions.js';
import { connectDB } from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.NODE_ENV);

connectDB();

//middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '../public')));

//routes
app.use('/', root);
app.use('/users', userRoutes);

//should be at the end
app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', '..', 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: 'Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// for unhandled errors
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to Mongo');
  app.listen(PORT, () => console.log(`running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.synccall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});
