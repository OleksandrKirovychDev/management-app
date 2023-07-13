import express from 'express';
const router = express.Router();

import * as notesController from '../controllers/notesController.js';

router
  .route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

export default router;
