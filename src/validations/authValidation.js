import { Joi, Segments } from 'celebrate';

const usernamePattern = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9_ ]+$/;

export const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().required().lowercase().messages({
      'string.base': 'Email має бути рядком',
      'string.empty': 'Email не може бути пустим',
      'string.email': 'Email повинен бути дійсною електронною адресою',
      'any.required': 'Email є обовʼязковим',
    }),

    password: Joi.string().trim().min(8).max(20).required().messages({
      'string.base': 'Пароль має бути рядком',
      'string.empty': 'Пароль не може бути пустим',
      'string.min': 'Пароль має бути не менше 8 символів',
      'string.max': 'Пароль має бути не більше 20 символів',
      'any.required': 'Пароль є обовʼязковим',
    }),
  }),
};

export const registerSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().trim().required().min(3).max(18).pattern(usernamePattern).messages({
      'string.base': 'Імʼя користувача має бути рядком',
      'string.empty': 'Імʼя користувача не може бути пустим',
      'string.min': 'Імʼя користувача має бути не менше 3 символів',
      'string.max': 'Імʼя користувача має бути не більше 18 символів',
      'any.required': 'Імʼя користувача є обовʼязковим',
      'string.pattern.base': 'Імʼя користувача може містити лише літери (укр/лат), цифри, пробіли та підкреслення',
    }),

    email: Joi.string().trim().email().required().lowercase().messages({
      'string.base': 'Email має бути рядком',
      'string.empty': 'Email не може бути пустим',
      'string.email': 'Email повинен бути дійсною електронною адресою',
      'any.required': 'Email є обовʼязковим',
    }),

    password: Joi.string().trim().min(8).max(20).required().messages({
      'string.base': 'Пароль має бути рядком',
      'string.empty': 'Пароль не може бути пустим',
      'string.min': 'Пароль має бути не менше 8 символів',
      'string.max': 'Пароль має бути не більше 20 символів',
      'any.required': 'Пароль є обовʼязковим',
    }),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().required().lowercase().messages({
      'string.base': 'Email має бути рядком',
      'string.empty': 'Email не може бути пустим',
      'string.email': 'Email повинен бути дійсною електронною адресою',
      'any.required': 'Email є обовʼязковим',
    }),
  }),
};

export const verifyEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().required().lowercase().messages({
      'string.empty': 'Email не може бути пустим',
      'string.email': 'Email повинен бути дійсною електронною адресою',
      'any.required': 'Email є обовʼязковим',
    }),
    code: Joi.string().trim().length(6).pattern(/^\d+$/).required().messages({
      'string.empty': 'Код не може бути пустим',
      'string.length': 'Код має складатися з 6 цифр',
      'string.pattern.base': 'Код має містити лише цифри',
      'any.required': 'Код є обовʼязковим',
    }),
  }),
};

export const resendVerificationSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().email().required().lowercase().messages({
      'string.empty': 'Email не може бути пустим',
      'string.email': 'Email повинен бути дійсною електронною адресою',
      'any.required': 'Email є обовʼязковим',
    }),
  }),
};
