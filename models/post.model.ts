import mongoose, { Schema } from 'mongoose';
import { IPost } from '@/types/post';

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const PostModel = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
