import prisma from "../config/database.js";

export const getRoles = async (req) => {
  try {
    return await prisma.roles.findMany({
      where: {
        company: req.company ? Number(req.company) : null,
      },
      select: {
        id: true,
        isActive: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        displayName: true,
        createdByUser: { select: { displayName: true } },
        updatedByUser: { select: { displayName: true } },
        deletedByUser: { select: { displayName: true } },
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addRole = async (req) => {
  try {
    const { body, currentUser } = req;

    const dataToCreate = {
      ...body,
      createdAt: new Date(),
      createdBy: currentUser.id,
    };

    Object.keys(dataToCreate).forEach(
      (key) => dataToCreate[key] === undefined && delete dataToCreate[key]
    );

    await prisma.roles.create({
      data: dataToCreate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchRole = async (req) => {
  try {
    const { body, currentUser } = req;
    const { role, ...bodyData } = body;

    const dataToUpdate = {
      ...bodyData,
      deletedBy: null,
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: currentUser.id,
    };

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await prisma.roles.update({
      where: { id: role },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteRole = async (req) => {
  try {
    const { role } = req.query;
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

    await prisma.roles.update({
      where: { id: Number(role) },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};
