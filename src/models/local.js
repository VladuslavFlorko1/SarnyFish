import { Schema, model } from 'mongoose';

const locationSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    fish: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    images: {
      type: [String],
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['річка', 'озеро', 'струмок', 'басейн', 'ставок', 'інше'],
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

locationSchema.index({ city: 1, type: 1, fish: 1 });
locationSchema.index({ 'likes.count': -1 });
locationSchema.index({ createdAt: -1 });

export const Location = model('Location', locationSchema);
