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
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        displayName: true,
        mobileNumber: true,
        profilePicture: true,
        createdByUser: { select: { displayName: true } },
        updatedByUser: { select: { displayName: true } },
        deletedByUser: { select: { displayName: true } },
        roleRelation: {
          select: {
            id: true,
            displayName: true,
          },
        },
        companyRelation: {
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
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getScreens = async (req) => {
  try {
    let functions = [];

    if (req.company) {
      const parentFunctions = await prisma.functions.findMany({
        where: {
          isDeleted: false,
          companiesModules: {
            some: { company: Number(req.company) },
          },
        },
        select: {
          id: true,
          menuName: true,
          parentMenu: true,
          displayName: true,
        },
      });

      const parentNames = parentFunctions.map((f) => f.menuName);

      const childFunctions = await prisma.functions.findMany({
        where: {
          isDeleted: false,
          parentMenu: { in: parentNames },
        },
        select: {
          id: true,
          displayName: true,
          parentMenu: true,
        },
      });

      functions = [...parentFunctions, ...childFunctions];
    } else {
      functions = await prisma.functions.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          parentMenu: true,
          displayName: true,
        },
      });
    }

    return functions;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addUser = async (req) => {
  const { body, currentUser } = req;

  try {
    const dataToCreate = {
      ...body,
      password: "$2b$10$ZKSMq.d7Ximg1PU0bDfDk.2ZrjM94xKPr2KqFOdDs6YBb7.OO69TW",
      createdAt: new Date(),
      createdBy: currentUser.id,
    };

    delete dataToCreate.screens;

    Object.keys(dataToCreate).forEach(
      (key) => dataToCreate[key] === undefined && delete dataToCreate[key]
    );

    const createdUser = await prisma.usersAccounts.create({
      data: dataToCreate,
    });

    if (body.screens && body.screens.length > 0) {
      const data = body.screens.map((screen) => ({
        function: screen,
        user: createdUser.id,
        createdAt: new Date(),
        createdBy: currentUser.id,
      }));

      await prisma.userFunctions.createMany({
        data,
        skipDuplicates: true,
      });
    }

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchUser = async (req) => {
  try {
    const { body, currentUser } = req;

    const { user, role, company, screens, password, ...restBody } = body;

    let dataToUpdate = {
      ...restBody,
      updatedAt: new Date(),
      updatedByUser: { connect: { id: currentUser.id } },
    };

    if (role !== undefined) {
      dataToUpdate.roleRelation = { connect: { id: role } };
    }

    if (company !== undefined) {
      dataToUpdate.companyRelation = { connect: { id: company } };
    }

    if (screens && screens.length > 0) {
      const data = screens.map((screen) => ({
        user: user,
        function: screen,
      }));

      await prisma.userFunctions.createMany({
        data,
        skipDuplicates: true,
      });
    }

    if (password) {
      const rounds = 10;
      const hashedPassword = await bcrypt.hash(password, rounds);
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
