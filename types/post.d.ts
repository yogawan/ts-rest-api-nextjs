import { Document, Types } from 'mongoose';
import { IUser } from './user';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
