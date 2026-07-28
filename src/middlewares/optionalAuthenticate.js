import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const optionalAuthenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    req.user = null;
    return next();
  }

  const session = await Session.findOne({ _id: sessionId, accessToken });

  if (!session) {
    req.user = null;
    return next();
  }

  const isSessionTokenExpired =
    Date.now() > session.accessTokenExpiresAt.getTime();

  if (isSessionTokenExpired) {
    req.user = null;
    return next();
  }

  const user = await User.findById(session.userId);
  req.user = user || null;

  next();
};
