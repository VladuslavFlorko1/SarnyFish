import createError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res, next) =>
   {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(createError(409, "Користувач з таким ім'ям або електронною поштою вже існує"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const newSession = await createSession(newUser._id);

    setSessionCookies(res, newSession);

    res.status(201).json(newUser);
  }

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createError(401, "Невірна електронна пошта або пароль"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(createError(401, "Невірна електронна пошта або пароль"));
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);

  setSessionCookies(res, newSession);

  res.status(200).json(user);
};


export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if ( sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");
  res.status(204).send();
};

const clearSessionCookies = (res) => {
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export const refreshSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createError(401, 'Немає доступу');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createError(401, 'Немає доступу');
  }

  const isSessionTokenExpired =
    Date.now() > session.refreshTokenExpiresAt.getTime();

  if (isSessionTokenExpired) {
    await session.deleteOne();

    clearSessionCookies(res);

    throw createError(401, 'Немає доступу');
  }

  const newSession = await createSession(session.userId);

  await session.deleteOne();

  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
