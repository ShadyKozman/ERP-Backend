import Joi from "joi";

/* -------------------Tested Successfully-------------------*/
export const loginSchema = Joi.object({
  emailOrMobile: Joi.string()
    .allow(null)
    .empty(null)
    .custom((value, helpers) => {
      const isMobile =
        /^(\+?20)?(010|011|012|015)\d{8}$|^(\+?971)?(50|52|54|55|56|58)\d{7}$| ^(\+?966)?5\d{8}$/.test(
          value
        );
      const isEmail = Joi.string().email().validate(value).error === undefined;

      if (!isEmail && !isMobile) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .required()
    .messages({
      "any.required": "Email/mobile is required",
      "string.empty": "Email/mobile cannot be empty",
      "any.invalid": "Please enter a valid email or mobile number",
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
