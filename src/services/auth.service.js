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
      userCompany: {
        select: {
          id: true,
          displayName: true,
          isActive: true,
          isDeleted: true,
          CompaniesModules: {
            select: {
              module: true,
            },
          },
        },
      },
      userRole: {
        select: {
          id: true,
          displayName: true,
        },
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
    user.userCompany &&
    (user.userCompany.isActive === false || user.userCompany.isDeleted === true)
  )
    throw new BadRequestError(
      "User company not active or is deleted, contact your admin"
    );

  let allowedFunctions = user.userFunctions;

  if (user.userCompany) {
    const companyModuleIds = user.userCompany.CompaniesModules.map(
      (cm) => cm.module
    );

    allowedFunctions = allowedFunctions.filter((rf) =>
      companyModuleIds.includes(rf.Function.id)
    );
  }

  const uniqueFunctionsMap = new Map();

  allowedFunctions.forEach((rf) => {
    if (!uniqueFunctionsMap.has(rf.Function.id)) {
      uniqueFunctionsMap.set(rf.Function.id, {
        key: rf.Function.menuName,
        label: rf.Function.displayName,
        icon: rf.Function.icon,
        parent_key: rf.Function.parentMenu,
      });
    }
  });

  user.userFunctions = Array.from(uniqueFunctionsMap.values());

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
