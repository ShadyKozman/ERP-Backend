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
      profilePicture: true,
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

  const companyModules =
    user.companyRelation?.companiesModules?.map((cm) => cm.module) || [];

  const userAssignedFunctions = user.userFunctions.map((uf) => uf.Function);

  const isParent = (fn) => companyModules.includes(fn.id);

  const isChild = (fn) =>
    !isParent(fn) &&
    fn.parentMenu &&
    parentModules.some((p) => p.menuName === fn.parentMenu);

  const parentModules = userAssignedFunctions.filter(isParent);

  const moduleChildren = userAssignedFunctions.filter(isChild);

  const standaloneFunctions = userAssignedFunctions.filter(
    (fn) => !isParent(fn) && !fn.parentMenu
  );

  const moduleMenuTree = parentModules.map((parent) => ({
    icon: parent.icon,
    key: parent.menuName,
    label: parent.displayName,
    children: moduleChildren
      .filter((child) => child.parentMenu === parent.menuName)
      .map((child) => ({
        icon: child.icon,
        key: child.menuName,
        label: child.displayName,
      })),
  }));

  const standaloneMenuTree = standaloneFunctions.map((fn) => ({
    children: [],
    icon: fn.icon,
    key: fn.menuName,
    label: fn.displayName,
  }));

  user.userFunctions = [...moduleMenuTree, ...standaloneMenuTree];

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

export const sendOTP = async (body) => {
  const { emailOrMobile } = body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

  const where = isEmail
    ? { email: emailOrMobile }
    : { mobileNumber: emailOrMobile };

  const user = await prisma.usersAccounts.findUnique({
    where,
    select: {
      id: true,
      email: true,
      isActive: true,
      mobileNumber: true,

      companyRelation: {
        select: {
          id: true,
          isActive: true,
          isDeleted: true,
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

  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.usersAccounts.update({
    where: { id: user.id },
    data: { passwordOTP: Number(OTP) },
  });

  return {};
};

export const forgotPassword = async (body) => {
  const { emailOrMobile, otp } = body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

  const where = isEmail
    ? { email: emailOrMobile }
    : { mobileNumber: emailOrMobile };

  const user = await prisma.usersAccounts.findUnique({
    where,
    select: {
      id: true,
      isActive: true,
      passwordOTP: true,

      companyRelation: {
        select: {
          id: true,
          isActive: true,
          isDeleted: true,
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

  if (otp !== user.passwordOTP)
    throw new BadRequestError("OTP is invalid, please try again");

  await prisma.usersAccounts.update({
    where: { id: user.id },
    data: {
      passwordOTP: null,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  return {};
};
