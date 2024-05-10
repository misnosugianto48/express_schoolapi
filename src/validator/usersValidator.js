import Joi from "joi";

export const registerUserValidator = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});