import express from "express";

import authenticateToken from "../middlewares/authHandler.js";

import validateRequest from "../middlewares/requestValidatorHandler.js";

import {
  addCompanySchema,
  patchCompanySchema,
  deleteCompanySchema,
} from "../validators/companiesAccounts.validator.js";

import {
  addCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
} from "../controllers/companiesAccounts.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getAllCompanies);

router.post(
  "/",
  authenticateToken,
  validateRequest(addCompanySchema),
  addCompany
);

router.patch(
  "/",
  authenticateToken,
  validateRequest(patchCompanySchema),
  updateCompany
);

router.delete(
  "/",
  authenticateToken,
  validateRequest(deleteCompanySchema, { convert: true }),
  deleteCompany
);

export default router;
