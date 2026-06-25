import crypto from "crypto";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "../constants/time.js";
import { Session } from "../models/session.js";

export const createSession = async (userId) => {

  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

export const setSessionCookies = (res, sesseon) => {
  res.cookie("accessToken", sesseon.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ACCESS_TOKEN_LIFETIME,
  });
  res.cookie("refreshToken", sesseon.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
  res.cookie("sessionId", sesseon._id, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
}

