import Joi from "joi";

export const loginSchema = Joi.object({
  emailOrMobile: Joi.string()
    .allow(null)
    .empty(null)
    .custom((value, helpers) => {
      const isMobile = /^\+?[0-9]{10,15}$/.test(value);
      const isEmail = Joi.string().email().validate(value).error === undefined;

      if (!isEmail && !isMobile) {
        return helpers.error("any.invalid");
      }

      return value;
    }, "Login Validation")
    .required()
    .messages({
      "any.required": "Email/mobile is required",
      "string.empty": "Email/mobile cannot be empty",
      "any.invalid": "Please enter a valid email or mobile number",
      "string.base":
        "Email must contain only characters/Mobile must contain only numbers",
    }),

  password: Joi.string().allow(null).empty(null).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
    "string.empty": "Refresh token cannot be empty",
    "string.base": "Refresh token must be a text value",
  }),
});
