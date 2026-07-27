import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { FriendRequest } from '../models/friendRequest.js';
import { uploadToCloudinary } from '../services/uploadToCloudinary.js';

export const getCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw createHttpError(404, 'Користувача не знайдено');
  }

  let relationStatus = 'none';
  let requestId = null;

  const isFriend = req.user.friends.some((f) => f.toString() === id);

  if (isFriend) {
    relationStatus = 'friends';
  } else {
    const request = await FriendRequest.findOne({
      status: 'pending',
      $or: [
        { from: req.user._id, to: id },
        { from: id, to: req.user._id },
      ],
    });

    if (request) {
      requestId = request._id;
      relationStatus =
        request.from.toString() === req.user._id.toString()
          ? 'pending_sent'
          : 'pending_received';
    }
  }

  res.status(200).json({
    user,
    relationStatus,
    requestId,
  });
};

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Файл аватара не надано');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'avatars');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );

  res.status(200).json({ avatar: user.avatar });
};
