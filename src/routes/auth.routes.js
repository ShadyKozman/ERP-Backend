import express from "express";

import {
  loginSchema,
  sendOTPSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
} from "../validators/auth.validator.js";

import authenticateToken from "../middlewares/authHandler.js";

import * as authController from "../controllers/auth.controller.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

const router = express.Router();

/* -------------------Tested Successfully-------------------*/
router.post("/login", validateRequest(loginSchema), authController.login);

router.post(
  "/refreshToken",
  authenticateToken,
  validateRequest(refreshTokenSchema),
  authController.refreshAccessToken
);

router.post("/sendOTP", validateRequest(sendOTPSchema), authController.sendOTP);

router.post(
  "/forgotPassword",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);

export default router;
