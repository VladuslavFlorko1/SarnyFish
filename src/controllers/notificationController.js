import { Notification } from '../models/notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'username avatar')
    .populate('location', 'name images')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({ notifications });
};

export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({ count });
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true },
  );

  res.status(200).json({ message: 'Позначено як прочитане' });
};
