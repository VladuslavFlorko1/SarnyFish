// src/db/connectMongoDB.js
import mongoose from 'mongoose';
import { Location } from '../models/local.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ Підключення до MongoDB успішне');

    await Location.createIndexes();
  } catch (error) {
    console.error('❌ Помилка підключення до MongoDB', error.message);
    process.exit(1);
  }
};
