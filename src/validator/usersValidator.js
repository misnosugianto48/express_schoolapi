import Joi from "joi";

export const registerUserValidator = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

export const loginUserValidator = Joi.object({
  email: Joi.string().email().required().max(100),
  password: Joi.string().required().max(100)
});