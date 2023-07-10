import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import root from './routes/root.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { __dirname } from './global/variables.js';
import { corsOptions } from './config/corsOptions.js';

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/', root);

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

app.listen(PORT, () => console.log(`running on port ${PORT}`));
