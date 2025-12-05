import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import prisma from "../config/database.js";

import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../middlewares/responseHandler.js";

/* -------------------Tested Successfully-------------------*/
export const login = async (body) => {
  const { emailOrMobile, password } = body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

  const where = isEmail
    ? { email: emailOrMobile }
    : { mobileNumber: emailOrMobile };

  const user = await prisma.usersAccounts.findUnique({
    where,
    select: {
      id: true,
      email: true,
      password: true,
      isActive: true,
      displayName: true,
      isFirstLogin: true,
      mobileNumber: true,
      createdByUser: { select: { displayName: true } },
      updatedByUser: { select: { displayName: true } },
      deletedByUser: { select: { displayName: true } },

      companyRelation: {
        select: {
          id: true,
          displayName: true,
          isActive: true,
          isDeleted: true,
          companiesModules: {
            select: {
              module: true,
            },
          },
        },
      },

      roleRelation: {
        select: { id: true, displayName: true },
      },

      userFunctions: {
        select: {
          id: true,
          Function: {
            select: {
              id: true,
              menuName: true,
              displayName: true,
              icon: true,
              parentMenu: true,
            },
          },
        },
      },
    },
  });

  if (!user) throw new NotFoundError("User not found");
  if (!user.isActive)
    throw new BadRequestError("User not active, contact your admin");

  if (
    user.companyRelation &&
    (user.companyRelation.isActive === false ||
      user.companyRelation.isDeleted === true)
  ) {
    throw new BadRequestError(
      "User company not active or is deleted, contact your admin"
    );
  }

  /*
  ----------------------------------------------------------
  BUILD USER MENU TREE
  ----------------------------------------------------------
  */

  // 1️⃣ Company-level parent modules (Function IDs)
  // 1️⃣ Company-level parent module IDs
  const companyParentIds = user.companyRelation
    ? user.companyRelation.companiesModules.map((cm) => cm.module)
    : [];

  // 2️⃣ Extract all assigned functions
  const functions = user.userFunctions.map((uf) => uf.Function);

  // 3️⃣ Split functions:

  // Parents that match company modules
  const parents = functions.filter((fn) => companyParentIds.includes(fn.id));

  // Children that belong under a company parent
  const moduleChildren = functions.filter(
    (fn) =>
      !companyParentIds.includes(fn.id) && // not a parent
      fn.parentMenu && // has a parent
      parents.some((p) => p.menuName === fn.parentMenu)
  );

  // 4️⃣ Standalone functions (not tied to company modules)
  const standaloneFunctions = functions.filter(
    (fn) =>
      !companyParentIds.includes(fn.id) && // not a parent module
      !fn.parentMenu // no parentMenu = standalone
  );

  // 5️⃣ Build menu tree for company-related modules
  const moduleMenuTree = parents.map((parent) => ({
    key: parent.menuName,
    label: parent.displayName,
    icon: parent.icon,
    children: moduleChildren
      .filter((child) => child.parentMenu === parent.menuName)
      .map((child) => ({
        key: child.menuName,
        label: child.displayName,
        icon: child.icon,
      })),
  }));

  // 6️⃣ Add standalone functions as top-level menu items
  const standaloneMenuTree = standaloneFunctions.map((fn) => ({
    key: fn.menuName,
    label: fn.displayName,
    icon: fn.icon,
    children: [],
  }));

  // 7️⃣ Final menu tree (company + independent)
  const menuTree = [...moduleMenuTree, ...standaloneMenuTree];

  user.userFunctions = menuTree;

  /*
  ----------------------------------------------------------
  AUTHENTICATION LOGIC (unchanged)
  ----------------------------------------------------------
  */

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new BadRequestError("Invalid credentials");

  const { password: _, ...userData } = user;

  const tokenPayload = {
    id: userData.id,
    email: emailOrMobile,
    loginMethod: isEmail ? "email" : "mobileNumber",
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });

  await prisma.usersAccounts.update({
    where: { id: userData.id },
    data: { refreshToken: refreshToken, lastLogin: new Date() },
  });

  return { ...userData, token };
};

export const refreshAccessToken = async (req) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new ForbiddenError("No refresh token provided");

  const user = await prisma.usersAccounts.findUnique({
    where: { id: req.currentUser.id },
    select: {
      refreshToken: true,
    },
  });

  if (!user?.refreshToken)
    throw new ForbiddenError("User has no associated refresh token");

  if (user.refreshToken !== refreshToken)
    throw new ForbiddenError("Invalid refresh token");

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        loginMethod: decoded.loginMethod,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );

    return { token: newAccessToken };
  } catch (err) {
    throw new ForbiddenError("Refresh token expired or invalid");
  }
};
