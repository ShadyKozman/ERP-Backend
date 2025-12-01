import { sendSuccess } from "../middlewares/responseHandler.js";

import * as companyService from "../services/companiesAccounts.service.js";

/* -------------------Tested Successfully-------------------*/
export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies();

    sendSuccess(res, companies, "Fetched companies", 200);
  } catch (err) {
    next(err);
  }
};

export const addCompany = async (req, res, next) => {
  try {
    const companies = await companyService.addCompany(req);

    sendSuccess(res, companies, "Company created", 200);
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const users = await companyService.patchCompany(req);

    sendSuccess(res, users, "Company updated", 200);
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const users = await companyService.deleteCompany(req);

    sendSuccess(res, users, "Company deleted", 200);
  } catch (err) {
    next(err);
  }
};
