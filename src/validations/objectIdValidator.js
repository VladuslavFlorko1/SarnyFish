import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator  = (value, helpers) => {
    return isValidObjectId(value) ? value : helpers.message('Невірний формат ObjectId');
};

export const idValidationSchema = {
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().custom(objectIdValidator).required(),
    }),
};
