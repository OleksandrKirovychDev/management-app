import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: [
      {
        type: Boolean,
        default: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

AutoIncrement(noteSchema);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 1,
});

export default mongoose.model('Note', noteSchema);
