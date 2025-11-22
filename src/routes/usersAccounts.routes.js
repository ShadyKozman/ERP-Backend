import express from "express";

import authenticateToken from "../middlewares/authHandler.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

import {
  addUserSchema,
  getUsersSchema,
  patchUserSchema,
  deleteUserSchema,
} from "../validators/usersAccounts.validator.js";

import {
  addUser,
  deleteUser,
  updateUser,
  getAllUsers,
} from "../controllers/usersAccounts.controller.js";

const router = express.Router();

router.post("/", authenticateToken, validateRequest(addUserSchema), addUser);

router.get(
  "/",
  authenticateToken,
  validateRequest(getUsersSchema),
  getAllUsers
);

router.patch(
  "/",
  authenticateToken,
  validateRequest(patchUserSchema),
  updateUser
);

router.delete(
  "/",
  authenticateToken,
  validateRequest(deleteUserSchema, { convert: true }),
  deleteUser
);

export default router;
