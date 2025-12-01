import * as authService from "../services/auth.service.js";

import { sendSuccess, sendError } from "../middlewares/responseHandler.js";

/* -------------------Tested Successfully-------------------*/
export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (!result) return sendError(res, "Login failed", 400);

    sendSuccess(res, result, "Login Successful", 200);
  } catch (err) {
    sendError(res, err.message, 400);
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const result = await authService.refreshAccessToken(req);

    if (!result) return sendError(res, "Token refresh failed", 400);

    sendSuccess(res, result, "Access token refreshed successfully", 200);
  } catch (err) {
    sendError(res, err.message, 400);
  }
};
