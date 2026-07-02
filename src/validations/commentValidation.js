import { Joi, Segments } from 'celebrate';

export const commentSchema = {
  [Segments.BODY]: Joi.object({
    text: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'Коментар має бути рядком',
        'string.empty': 'Коментар не може бути порожнім',
        'string.min': 'Коментар не може бути порожнім',
        'string.max': 'Коментар не може перевищувати 1000 символів',
        'any.required': 'Текст коментаря є обовʼязковим',
      }),
  }),
};

export const updateCommentSchema = {
  [Segments.BODY]: Joi.object({
    text: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'Коментар має бути рядком',
        'string.empty': 'Коментар не може бути порожнім',
        'string.min': 'Коментар не може бути порожнім',
        'string.max': 'Коментар не може перевищувати 1000 символів',
        'any.required': 'Текст коментаря є обовʼязковим',
      }),
  }),
};
