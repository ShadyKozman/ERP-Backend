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

  modules: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "Modules must be an array",
    "array.includes": "Modules must contain numbers",
  }),

  logo: Joi.string().optional().allow(null).messages({
    "string.empty": "Company logo cannot be empty",
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

  modules: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "Modules must be an array",
    "array.includes": "Modules must contain numbers",
  }),

  logo: Joi.string().optional().allow(null).messages({
    "string.empty": "Company logo cannot be empty",
  }),
});

export const deleteCompanySchema = Joi.object({
  company: Joi.number().required().messages({
    "any.required": "Company to be deleted is required",
    "number.base": "Company to be deleted must be a number",
  }),
});
