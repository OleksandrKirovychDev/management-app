import mongoose from 'mongoose';
import { TRoles } from '../types/rolesType.js';

export interface IUser {
  username: string;
  password: string;
  roles: TRoles[];
  active: boolean;
}

export type TCreatedUser = IUser & { id: string };

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
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

export default mongoose.model<IUser>('User', userSchema);
