import createError from "http-errors";
import { User } from "../models/user.js";

export const registerUser = async (req, res, next) =>
   {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(createError(409, "Користувач з таким ім'ям або електронною поштою вже існує"));
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Користувач успішно зареєстрований", user: newUser });
  }
