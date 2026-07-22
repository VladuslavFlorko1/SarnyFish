import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middlewares/authenticate.js';
import {
  userIdParamSchema,
  requestIdParamSchema,
} from '../validations/friendValidation.js';
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendsStats,
  getReceivedRequests,
  getSentRequests,
  getFriendsList,
} from '../controllers/friendController.js';

const friendRouter = Router();

friendRouter.get('/friends', authenticate, getFriendsList);
friendRouter.get('/friends/stats', authenticate, getFriendsStats);
friendRouter.get('/friends/requests/received', authenticate, getReceivedRequests);
friendRouter.get('/friends/requests/sent', authenticate, getSentRequests);

friendRouter.post(
  '/friends/request/:userId',
  authenticate,
  celebrate(userIdParamSchema),
  sendFriendRequest,
);

friendRouter.patch(
  '/friends/accept/:requestId',
  authenticate,
  celebrate(requestIdParamSchema),
  acceptFriendRequest,
);

friendRouter.delete(
  '/friends/reject/:requestId',
  authenticate,
  celebrate(requestIdParamSchema),
  rejectFriendRequest,
);

friendRouter.delete(
  '/friends/cancel/:requestId',
  authenticate,
  celebrate(requestIdParamSchema),
  cancelFriendRequest,
);

friendRouter.delete(
  '/friends/:userId',
  authenticate,
  celebrate(userIdParamSchema),
  removeFriend,
);

export default friendRouter;
