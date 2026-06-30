import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.index({ location: 1, createdAt: -1 });

export const Comment = model('Comment', commentSchema);
