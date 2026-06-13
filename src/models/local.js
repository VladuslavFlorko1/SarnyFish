import { Schema, model } from 'mongoose';

const locationSchema = new Schema(
  {
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
      enum: ['річка', 'озеро', 'струмок', 'басейн','ставок', 'інше'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Location = model('Location', locationSchema);
