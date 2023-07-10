import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path';

import { __dirname } from '../global/variables.js';

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  const logsPath = path.join(__dirname, '..', '..', 'logs');
  try {
    if (!fs.existsSync(logsPath)) {
      await fsPromises.mkdir(logsPath);
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', '..', 'logs', logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');

  console.log(`${req.method} ${req.path}`);
  next();
};
