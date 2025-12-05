import Joi from "joi";

export const getRolesSchema = Joi.object({
  company: Joi.number().optional().messages({
    "number.base": "Company must be a number",
  }),
});

export const addRoleSchema = Joi.object({
  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  isActive: Joi.boolean().required().messages({
    "any.required": "User status is required",
    "boolean.base": "User status must be true or false",
  }),

  company: Joi.number().required().messages({
    "any.required": "Company is required",
    "number.base": "Company must be a number",
  }),
});

export const patchRoleSchema = Joi.object({
  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  isActive: Joi.boolean().required().messages({
    "any.required": "User status is required",
    "boolean.base": "User status must be true or false",
  }),

  role: Joi.number().optional().messages({
    "number.base": "Role must be a number",
  }),
});

export const deleteRoleSchema = Joi.object({
  role: Joi.number().required().messages({
    "any.required": "Role to be deleted is required",
    "number.base": "Role to be deleted must be a number",
  }),
});
