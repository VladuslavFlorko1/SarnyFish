import { Joi, Segments } from 'celebrate';

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

const locationSchema = {
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

    coordinates: Joi.object({
      lat: Joi.number().required().min(50.3).max(52.2).messages({
        'number.base': 'Широта має бути числом',
        'any.required': 'Широта є обовʼязковою',
        'number.min': 'Широта має бути в межах Сарненського району',
        'number.max': 'Широта має бути в межах Сарненського району',
      }),

      lng: Joi.number().required().min(24.8).max(27.3).messages({
        'number.base': 'Довгота має бути числом',
        'any.required': 'Довгота є обовʼязковою',
        'number.min': 'Довгота має бути в межах Сарненського району',
        'number.max': 'Довгота має бути в межах Сарненського району',
      }),
    }).required().messages({
      'any.required': 'Координати є обовʼязковими',
    }),

    fish: Joi.array()
      .items(Joi.string().trim().valid(...FISH_TYPES))
      .unique()
      .messages({
        'array.base': 'Риби повинні бути масивом',
        'any.only': 'Вкажіть правильний вид риби',
        'array.unique': 'Одна й та сама риба не може повторюватися',
      }),

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

    images: Joi.array()
      .items(Joi.string().trim().uri())
      .min(1)
      .required()
      .messages({
        'array.base': 'Зображення мають бути масивом',
        'array.min': 'Потрібно вказати хоча б одне зображення',
        'any.required': 'Зображення є обовʼязковими',
        'string.uri': 'Кожне зображення повинно бути валідним URL',
      }),
  })
};

export default locationSchema;
