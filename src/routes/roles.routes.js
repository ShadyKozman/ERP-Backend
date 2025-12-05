import express from "express";

import authenticateToken from "../middlewares/authHandler.js";

import {
  addRoleSchema,
  getRolesSchema,
  patchRoleSchema,
  deleteRoleSchema,
} from "../validators/roles.validator.js";

import {
  addRole,
  updateRole,
  deleteRole,
  getAllRoles,
} from "../controllers/roles.controller.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  validateRequest(getRolesSchema),
  getAllRoles
);

router.post("/", authenticateToken, validateRequest(addRoleSchema), addRole);

router.patch(
  "/",
  authenticateToken,
  validateRequest(patchRoleSchema),
  updateRole
);

router.delete(
  "/",
  authenticateToken,
  validateRequest(deleteRoleSchema, { convert: true }),
  deleteRole
);

export default router;
