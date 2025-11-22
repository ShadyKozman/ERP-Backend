import express from "express";

import {
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";

import authenticateToken from "../middlewares/authHandler.js";

import * as authController from "../controllers/auth.controller.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), authController.login);

router.post(
  "/refreshToken",
  authenticateToken,
  validateRequest(refreshTokenSchema),
  authController.refreshAccessToken
);

export default router;
