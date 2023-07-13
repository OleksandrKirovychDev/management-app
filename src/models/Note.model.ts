import mongoose from 'mongoose';

export interface INote {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
}

export type TCreatedNote = INote & { id: string };

const noteSchema = new mongoose.Schema<INote>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<INote>('Note', noteSchema);
