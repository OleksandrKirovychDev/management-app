import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pasword: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: 'employee',
    },
  ],
  active: [
    {
      type: Boolean,
      default: true,
    },
  ],
});

export default mongoose.model('User', userSchema);
