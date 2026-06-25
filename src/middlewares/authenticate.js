import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Немає доступу');
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, 'Сесію не знайдено');
  }

  const isSessionTokenExpired =
    Date.now() > session.accessTokenExpiresAt.getTime();

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Сесія закінчилася');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Користувача не знайдено');
  }

  req.user = user;

  next();
};
