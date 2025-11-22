import Joi from "joi";

export const getUsersSchema = Joi.object({
  company: Joi.number().optional().messages({
    "number.base": "Company must be a number",
  }),
});

export const addUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
  }),

  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  mobileNumber: Joi.string().required().messages({
    "any.required": "Mobile number is required",
    "string.empty": "Mobile number cannot be empty",
    "string.base": "Mobile number must contain only characters",
  }),

  isActive: Joi.boolean().required().messages({
    "any.required": "User status is required",
    "boolean.base": "User status must be true or false",
  }),

  role: Joi.number().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),

  company: Joi.number().required().messages({
    "any.required": "Company is required",
    "number.base": "Company must be a number",
  }),
});

export const patchUserSchema = Joi.object({
  password: Joi.string().optional().messages({
    "string.empty": "Password cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  mobileNumber: Joi.string().optional().messages({
    "any.required": "Mobile number is required",
    "string.empty": "Mobile number cannot be empty",
    "string.base": "Mobile number must contain only characters",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "User status must be true or false",
  }),

  user: Joi.number().optional().messages({
    "number.base": "User must be a number",
  }),

  role: Joi.number().optional().messages({
    "number.base": "Role must be a number",
  }),

  company: Joi.number().optional().messages({
    "number.base": "Company must be a number",
  }),
});

export const deleteUserSchema = Joi.object({
  user: Joi.number().required().messages({
    "any.required": "User to be deleted is required",
    "number.base": "User to be deleted must be a number",
  }),
});
