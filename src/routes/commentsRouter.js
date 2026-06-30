import { Router } from "express";
import { celebrate } from "celebrate";

import {
  getCommentsByLocation,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";

import { authenticate } from "../middlewares/authenticate.js";
import {
  commentSchema,
  updateCommentSchema,
} from "../validations/commentValidation.js";

import {
  locationIdSchema,
  commentIdSchema,
} from "../validations/objectIdValidator.js";

const commentsRouter = Router();

commentsRouter.get(
  "/locations/:locationId/comments",
  celebrate(locationIdSchema),
  getCommentsByLocation
);

commentsRouter.post(
  "/locations/:locationId/comments",
  authenticate,
  celebrate(locationIdSchema),
  celebrate(commentSchema),
  createComment
);

commentsRouter.patch(
  "/locations/:locationId/comments/:commentId",
  authenticate,
  celebrate(commentIdSchema),
  celebrate(updateCommentSchema),
  updateComment
);

commentsRouter.delete(
  "/locations/:locationId/comments/:commentId",
  authenticate,
  celebrate(commentIdSchema),
  deleteComment
);

export default commentsRouter;
