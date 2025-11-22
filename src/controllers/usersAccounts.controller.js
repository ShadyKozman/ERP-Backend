import { sendSuccess } from "../middlewares/responseHandler.js";

import * as userService from "../services/usersAccounts.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query);

    sendSuccess(res, users, "Fetched users", 200);
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const { body, currentUser } = req;

    const user = await userService.addUser(body, currentUser);

    sendSuccess(res, user, "User created", 200);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { body, currentUser } = req;

    const users = await userService.patchUser(body, currentUser);

    sendSuccess(res, users, "User updated", 200);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const users = await userService.deleteUser(req);

    sendSuccess(res, users, "User deleted", 200);
  } catch (err) {
    next(err);
  }
};
