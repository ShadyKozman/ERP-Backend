import { sendError } from "./responseHandler.js";

const validateRequest =
  (schema, options = {}) =>
  (req, res, next) => {
    const data = ["GET", "DELETE"].includes(req.method) ? req.query : req.body;

    const { error, value } = schema.validate(data, {
      ...options,
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    if (["GET", "DELETE"].includes(req.method)) {
      Object.keys(value).forEach((key) => {
        req.query[key] = value[key];
      });
    } else {
      req.body = value;
    }

    next();
  };

export default validateRequest;
