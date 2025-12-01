import Joi from "joi";

/* -------------------Tested Successfully-------------------*/
export const addCompanySchema = Joi.object({
  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "User status must be true or false",
  }),
});

export const patchCompanySchema = Joi.object({
  displayName: Joi.string().required().messages({
    "any.required": "Display name is required",
    "string.empty": "Display name cannot be empty",
    "string.base": "Display name must contain only characters",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "User status must be true or false",
  }),

  company: Joi.number().required().messages({
    "any.required": "Company is required",
    "number.base": "Company must be a number",
  }),
});

export const deleteCompanySchema = Joi.object({
  company: Joi.number().required().messages({
    "any.required": "Company to be deleted is required",
    "number.base": "Company to be deleted must be a number",
  }),
});
