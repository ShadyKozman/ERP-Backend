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

  screens: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "Screens must be an array",
    "array.includes": "Screens must contain numbers",
  }),
});

export const patchUserSchema = Joi.object({
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

  password: Joi.string().optional().messages({
    "string.empty": "Password cannot be empty",
    "string.base": "Display name must contain only characters",
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

  screens: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "Screens must be an array",
    "array.includes": "Screens must contain numbers",
  }),
});

export const deleteUserSchema = Joi.object({
  user: Joi.number().required().messages({
    "any.required": "User to be deleted is required",
    "number.base": "User to be deleted must be a number",
  }),
});

/* -------------------Tested Successfully-------------------*/
export const updateMyProfileSchema = Joi.object({
  displayName: Joi.string()
    .pattern(/^[\p{L}. ]+$/u)
    .required()
    .messages({
      "any.required": "Display name is required",
      "string.empty": "Display name cannot be empty",
      "string.pattern.base": "Display name must contain only letters",
    }),

  mobileNumber: Joi.string()
    .pattern(
      /^(\+?20)?(010|011|012|015)\d{8}$|^(\+?971)?(50|52|54|55|56|58)\d{7}$| ^(\+?966)?5\d{8}$/
    )
    .required()
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number cannot be empty",
      "string.pattern.base":
        "Mobile number must be a valid Egypt, UAE, or KSA number",
    }),

  password: Joi.string().optional().messages({
    "string.empty": "Password cannot be empty",
  }),
});
