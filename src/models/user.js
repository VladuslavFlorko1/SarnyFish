import { model, Schema } from 'mongoose';

const usersShema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dghwd7c3m/image/upload/v1782828518/62e9ba0691ba8f98b93e397fe14c47de_kldmk2.jpg",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false
   },

);

usersShema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = model('User', usersShema);
