import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { FriendRequest } from '../models/friendRequest.js';

export const sendFriendRequest = async (req, res) => {
  const fromId = req.user._id;
  const { userId: toId } = req.params;

  if (fromId.toString() === toId) {
    throw createHttpError(400, 'Не можна надіслати запит самому собі');
  }

  const targetUser = await User.findById(toId);
  if (!targetUser) {
    throw createHttpError(404, 'Користувача не знайдено');
  }

  const alreadyFriends = req.user.friends.some(
    (friendId) => friendId.toString() === toId,
  );
  if (alreadyFriends) {
    throw createHttpError(409, 'Ви вже друзі');
  }

  const existingRequest = await FriendRequest.findOne({
    status: 'pending',
    $or: [
      { from: fromId, to: toId },
      { from: toId, to: fromId },
    ],
  });

  if (existingRequest) {
    throw createHttpError(409, 'Запит вже надіслано');
  }

  const request = await FriendRequest.create({ from: fromId, to: toId });

  res.status(201).json({ request });
};

export const cancelFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  const request = await FriendRequest.findOne({
    _id: requestId,
    from: req.user._id,
    status: 'pending',
  });

  if (!request) {
    throw createHttpError(404, 'Запит не знайдено');
  }

  await request.deleteOne();

  res.status(200).json({ message: 'Запит скасовано' });
};

export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  const request = await FriendRequest.findOne({
    _id: requestId,
    to: req.user._id,
    status: 'pending',
  });

  if (!request) {
    throw createHttpError(404, 'Запит не знайдено');
  }

  request.status = 'accepted';
  await request.save();

  await User.findByIdAndUpdate(request.from, {
    $addToSet: { friends: request.to },
  });
  await User.findByIdAndUpdate(request.to, {
    $addToSet: { friends: request.from },
  });

  res.status(200).json({ message: 'Запит прийнято' });
};

export const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  const request = await FriendRequest.findOne({
    _id: requestId,
    to: req.user._id,
    status: 'pending',
  });

  if (!request) {
    throw createHttpError(404, 'Запит не знайдено');
  }

  await request.deleteOne();

  res.status(200).json({ message: 'Запит відхилено' });
};

export const removeFriend = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { friends: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $pull: { friends: req.user._id },
  });

  await FriendRequest.deleteMany({
    status: 'accepted',
    $or: [
      { from: req.user._id, to: userId },
      { from: userId, to: req.user._id },
    ],
  });

  res.status(200).json({ message: 'Видалено з друзів' });
};

export const getFriendsStats = async (req, res) => {
  const userId = req.user._id;

  const [friendsCount, sentPendingCount, receivedPendingCount] =
    await Promise.all([
      User.findById(userId).then((u) => u.friends.length),
      FriendRequest.countDocuments({ from: userId, status: 'pending' }),
      FriendRequest.countDocuments({ to: userId, status: 'pending' }),
    ]);

  res.status(200).json({
    friendsCount,
    sentPendingCount,
    receivedPendingCount,
  });
};

export const getReceivedRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    to: req.user._id,
    status: 'pending',
  }).populate('from', 'username avatar');

  res.status(200).json({ requests });
};

export const getSentRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    from: req.user._id,
    status: 'pending',
  }).populate('to', 'username avatar');

  res.status(200).json({ requests });
};

export const getFriendsList = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'friends',
    'username avatar',
  );

  res.status(200).json({ friends: user.friends });
};
