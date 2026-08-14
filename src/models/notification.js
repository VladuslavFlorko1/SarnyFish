import { model, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'friend_request', 'friend_accept'],
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = model('Notification', notificationSchema);
