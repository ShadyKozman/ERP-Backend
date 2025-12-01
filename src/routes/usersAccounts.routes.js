import express from "express";

import authenticateToken from "../middlewares/authHandler.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

import {
  addUserSchema,
  getUsersSchema,
  patchUserSchema,
  deleteUserSchema,
  updateMyProfileSchema,
} from "../validators/usersAccounts.validator.js";

import {
  addUser,
  deleteUser,
  updateUser,
  getAllUsers,
  updateProfile,
  getAllScreens,
} from "../controllers/usersAccounts.controller.js";

const router = express.Router();

router.get("/screens", authenticateToken, getAllScreens);

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

/* -------------------Tested Successfully-------------------*/
router.patch(
  "/profile",
  authenticateToken,
  validateRequest(updateMyProfileSchema),
  updateProfile
);

export default router;
