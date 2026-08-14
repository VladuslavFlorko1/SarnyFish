import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} from '../controllers/notificationController.js';

const notificationRouter = Router();

notificationRouter.get('/notifications', authenticate, getNotifications);
notificationRouter.get('/notifications/unread-count', authenticate, getUnreadCount);
notificationRouter.patch('/notifications/mark-read', authenticate, markAllAsRead);

export default notificationRouter;
