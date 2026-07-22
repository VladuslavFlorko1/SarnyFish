import { model, Schema } from 'mongoose';

const friendRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export const FriendRequest = model('FriendRequest', friendRequestSchema);
