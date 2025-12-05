import { sendSuccess } from "../middlewares/responseHandler.js";

import * as rolesService from "../services/roles.service.js";

export const getAllRoles = async (req, res, next) => {
  try {
    const users = await rolesService.getRoles(req.query);

    sendSuccess(res, users, "Fetched roles", 200);
  } catch (err) {
    next(err);
  }
};

export const addRole = async (req, res, next) => {
  try {
    const role = await rolesService.addRole(req);

    sendSuccess(res, role, "Role created", 200);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await rolesService.patchRole(req);

    sendSuccess(res, role, "Role updated", 200);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const role = await rolesService.deleteRole(req);

    sendSuccess(res, role, "Role deleted", 200);
  } catch (err) {
    next(err);
  }
};
