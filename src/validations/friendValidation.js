import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value)
    ? value
    : helpers.message('Невірний формат ObjectId');
};

export const userIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const requestIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    requestId: Joi.string().custom(objectIdValidator).required(),
  }),
};
