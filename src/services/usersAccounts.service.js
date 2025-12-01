import bcrypt from "bcrypt";

import prisma from "../config/database.js";

export const getUsers = async (req) => {
  try {
    return await prisma.usersAccounts.findMany({
      where: {
        ...(req.company && { company: Number(req.company) }),
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        displayName: true,
        mobileNumber: true,
        createdByUser: { select: { displayName: true } },
        updatedByUser: { select: { displayName: true } },
        deletedByUser: { select: { displayName: true } },
        userRole: {
          select: {
            id: true,
            displayName: true,
          },
        },
        userCompany: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getScreens = async (req) => {
  try {
    return await prisma.functions.findMany({
      where: {
        ...(req.company && { company: Number(req.company) }),
      },
      select: {
        id: true,
        parentMenu: true,
        displayName: true,
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addUser = async (req) => {
  const { body, currentUser } = req;

  delete body.screens;

  try {
    const dataToCreate = {
      ...body,
      password: "$2b$10$ZKSMq.d7Ximg1PU0bDfDk.2ZrjM94xKPr2KqFOdDs6YBb7.OO69TW",
      createdAt: new Date(),
      createdBy: currentUser.id,
    };

    // if (body.screens && body.screens.length > 0) {
    //   const data = body.screens.map((screen) => ({
    //     role: body.role,
    //     function: screen,
    //   }));

    //   await prisma.rolesFunctions.createMany({
    //     data,
    //     skipDuplicates: true,
    //   });
    // }

    Object.keys(dataToCreate).forEach(
      (key) => dataToCreate[key] === undefined && delete dataToCreate[key]
    );

    await prisma.usersAccounts.create({
      data: dataToCreate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchUser = async (req) => {
  try {
    const { body, currentUser } = req;

    const user = body.user;

    delete body.user;

    const dataToUpdate = {
      ...body,
      updatedAt: new Date(),
      updatedBy: currentUser.id,
    };

    if (body.screens && body.screens.length > 0) {
      const data = body.screens.map((screen) => ({
        role: body.role,
        function: screen,
      }));

      await prisma.rolesFunctions.createMany({
        data,
        skipDuplicates: true,
      });
    }

    if (body.password) {
      const rounds = 10;
      const hashedPassword = await bcrypt.hash(body.password, rounds);
      dataToUpdate.password = hashedPassword;
      dataToUpdate.isFirstLogin = false;
    }

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await prisma.usersAccounts.update({
      where: { id: user ?? currentUser.id },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteUser = async (req) => {
  try {
    const { user } = req.query;
    const { currentUser } = req;

    const dataToUpdate = {
      isActive: false,
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: currentUser.id,
    };

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await prisma.usersAccounts.update({
      where: { id: Number(user) },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

/* -------------------Tested Successfully-------------------*/
export const updateProfile = async (req) => {
  try {
    const { body, currentUser } = req;

    const dataToUpdate = {
      ...body,
      updatedAt: new Date(),
      updatedBy: currentUser.id,
    };

    if (body.password) {
      const rounds = 10;
      const hashedPassword = await bcrypt.hash(body.password, rounds);
      dataToUpdate.password = hashedPassword;
      dataToUpdate.isFirstLogin = false;
    }

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await prisma.usersAccounts.update({
      where: { id: currentUser.id },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};
