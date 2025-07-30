import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@/types/user';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
)

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
