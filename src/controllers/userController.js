import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { uploadToCloudinary } from '../services/uploadToCloudinary.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Файл аватара не надано');
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    'avatars'
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: result.secure_url,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    avatar: user.avatar,
  });
};
