import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI || 'dummy');
  } catch (error) {
    console.log(error);
  }
};
