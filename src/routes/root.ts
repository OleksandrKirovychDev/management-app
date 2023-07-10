import express, { Request, Response } from 'express';
import path from 'path';
import { __dirname } from '../global/variables.js';

const router = express.Router();

router.get('^/$|/index(.html)?', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});

export default router;
