import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const FISH_TYPES = [
  'щука',
  'окунь',
  'карась',
  'короп',
  'лин',
  'лящ',
  'плотва',
  'краснопірка',
  'уклейка',
  'густера',
  'судак',
  'сом',
  'жерех',
  'пічкур',
  'йорж',
  'ротан',
  'підуст',
  'минь',
  'марена',
  'амур',
];

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value)
    ? value
    : helpers.message('Невірний формат ObjectId');
};

export const updateLocationSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),

  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(3).max(18),

    description: Joi.string().trim().min(10).max(200),

    lat: Joi.number().min(50.3).max(52.2),

    lng: Joi.number().min(24.8).max(27.3),

    fish: Joi.alternatives().try(
      Joi.string().trim().valid(...FISH_TYPES),
      Joi.array().items(Joi.string().trim().valid(...FISH_TYPES)).unique()
    ),

    city: Joi.string().trim().min(3).max(18),

    type: Joi.string()
      .trim()
      .valid('річка', 'озеро', 'струмок', 'басейн', 'ставок', 'інше'),
  }).min(1),
};

export const locationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().required().min(3).max(18).messages({
      'string.base': 'Назва має бути рядком',
      'string.empty': 'Назва не може бути пустою',
      'string.min': 'Назва має бути не менше 3 символів',
      'string.max': 'Назва має бути не більше 18 символів',
      'any.required': 'Назва є обовʼязковою',
    }),

    description: Joi.string().trim().min(10).max(200).messages({
      'string.base': 'Опис має бути рядком',
      'string.min': 'Опис має бути не менше 10 символів',
      'string.max': 'Опис має бути не більше 200 символів',
    }),

    lat: Joi.number().required().min(50.3).max(52.2).messages({
      'number.base': 'Широта має бути числом',
      'any.required': 'Широта є обовʼязковою',
    }),

    lng: Joi.number().required().min(24.8).max(27.3).messages({
      'number.base': 'Довгота має бути числом',
      'any.required': 'Довгота є обовʼязковою',
    }),

    fish: Joi.alternatives().try(
      Joi.string().trim().valid(...FISH_TYPES),
      Joi.array().items(Joi.string().trim().valid(...FISH_TYPES)).unique()
    ),

    city: Joi.string().trim().required().min(3).max(18).messages({
      'string.base': 'Назва міста має бути рядком',
      'string.empty': 'Назва міста не може бути пустою',
      'string.min': 'Назва міста має бути не менше 3 символів',
      'string.max': 'Назва міста має бути не більше 18 символів',
      'any.required': 'Назва міста є обовʼязковою',
    }),

    type: Joi.string()
      .trim()
      .required()
      .valid('річка', 'озеро', 'струмок', 'басейн', 'ставок', 'інше')
      .messages({
        'string.base': 'Тип локації має бути рядком',
        'string.empty': 'Тип локації не може бути пустим',
        'any.required': 'Тип локації є обовʼязковим',
        'any.only': 'Тип локації має бути одним із дозволених значень',
      }),
  }),
};

export const getLocationSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(10),

    city: Joi.string().trim(),

    type: Joi.string().valid(
      'річка',
      'озеро',
      'струмок',
      'басейн',
      'ставок',
      'інше'
    ),

    fish: Joi.string().trim().allow(''),

    sort: Joi.string().valid('popular', 'newest'),
  }),
};
