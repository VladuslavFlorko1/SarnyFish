import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import crypto from 'crypto';
import { sendMail } from '../utils/sendMail.js';

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return next(
      createError(
        409,
        "Користувач з таким ім'ям або електронною поштою вже існує",
      ),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createError(401, 'Невірна електронна пошта або пароль'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(createError(401, 'Невірна електронна пошта або пароль'));
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);

  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
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

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, 'Користувача не знайдено');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  await sendMail({
    to: user.email,
    subject: 'Відновлення пароля SarnyFish',
    html: `
    <div style="
      max-width:600px;
      margin:40px auto;
      padding:40px;
      background:#ffffff;
      border-radius:16px;
      box-shadow:0 4px 20px rgba(0,0,0,.1);
      font-family:Arial,sans-serif;
      text-align:center;
    ">
      <h1 style="color:#2E7D32;">
        🐟 SarnyFish
      </h1>
      <h2 style="color:#333;">
        Відновлення пароля
      </h2>
      <p style="font-size:16px;color:#555;">
        Вітаємо, <b>${user.username}</b>!
      </p>
      <p style="font-size:16px;color:#555;line-height:1.6;">
        Ми отримали запит на відновлення пароля для вашого акаунта SarnyFish.
      </p>
      <a
        href="${process.env.APP_URL}/reset-password?token=${resetToken}"
        style="
          display:inline-block;
          margin-top:25px;
          padding:14px 32px;
          background:#2E7D32;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-size:16px;
          font-weight:bold;
        "
      >
        🔑 Скинути пароль
      </a>
      <p style="margin-top:20px;font-size:14px;color:#666;">
        Якщо кнопка не працює, скопіюйте це посилання у браузер:
      </p>

      <p style="word-break:break-all;font-size:14px;">
        ${process.env.APP_URL}/reset-password?token=${resetToken}
      </p>
      <p style="
        margin-top:30px;
        color:#777;
        font-size:14px;
      ">
        Посилання дійсне протягом <b>15 хвилин</b>.
      </p>
      <hr style="margin:35px 0;border:none;border-top:1px solid #eee;">
      <p style="
        color:#999;
        font-size:13px;
      ">
        Якщо ви не надсилали запит на зміну пароля, просто проігноруйте цей лист.
      </p>
    </div>
  `,
  });

  res.status(200).json({
    message: 'Лист для відновлення пароля відправлено',
  });
};
