import createHttpError from "http-errors";
import { Comment } from "../models/comment.js";

export const getCommentsByLocation = async (req, res) => {
  const { locationId } = req.params;

  const comments = await Comment.find({ location: locationId })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};

export const createComment = async (req, res) => {
  const { locationId } = req.params;
  const { text } = req.body;

  const comment = await Comment.create({
    text,
    location: locationId,
    author: req.user._id,
  });

  res.status(201).json(comment);
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw createHttpError(404, "Коментар не знайдено");
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw createHttpError(403, "Недостатньо прав");
  }

  comment.text = text;
  await comment.save();

  res.status(200).json(comment);
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw createHttpError(404, "Коментар не знайдено");
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw createHttpError(403, "Недостатньо прав");
  }

  await comment.deleteOne();

  res.sendStatus(204);
};
