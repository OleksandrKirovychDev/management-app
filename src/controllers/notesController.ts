import { Request, Response } from 'express';

import Note, { INote, TCreatedNote } from '../models/Note.model.js';
import User from '../models/User.model.js';

// @desc Get all notes
// @route GET /notes
// @access Private
export const getAllNotes = async (req: Request, res: Response) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();

  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  // Add username to each note before sending the response
  const notesWithUser: Array<INote & { username: string | null }> =
    await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();

        if (!user) {
          return { ...note, username: null };
        }

        return { ...note, username: user.username };
      })
    );

  return res.status(200).json(notesWithUser);
};

// @desc Create new note
// @route POST /notes
// @access Private
export const createNewNote = async (
  req: Request<{}, {}, INote>,
  res: Response
) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  // Create and store the new note
  const note = await Note.create({ user, title, text });

  if (note) {
    // Created
    return res.status(201).json({ message: 'New note created' });
  } else {
    return res.status(400).json({ message: 'Invalid note data received' });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
export const updateNote = async (
  req: Request<{}, {}, TCreatedNote>,
  res: Response
) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  return res.json(`'${updatedNote.title}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
export const deleteNote = async (
  req: Request<{}, {}, Pick<TCreatedNote, 'id'>>,
  res: Response
) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  return res.json(reply);
};
