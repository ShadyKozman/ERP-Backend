import prisma from "../config/database.js";

export const getCompanies = async () => {
  try {
    return await prisma.companiesAccounts.findMany({
      select: {
        id: true,
        isActive: true,
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

export const addCompany = async (body, currentUser) => {
  try {
    const dataToCreate = {
      ...body,
      createdAt: new Date(),
      createdBy: currentUser.id,
    };

    Object.keys(dataToCreate).forEach(
      (key) => dataToCreate[key] === undefined && delete dataToCreate[key]
    );

    await prisma.companiesAccounts.create({
      data: dataToCreate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchCompany = async (body, currentUser) => {
  try {
    const { company, ...bodyData } = body;

    const dataToUpdate = {
      ...bodyData,
      updatedAt: new Date(),
      updatedBy: currentUser.id,
    };

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await prisma.companiesAccounts.update({
      where: { id: company },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteCompany = async (req) => {
  try {
    const { company } = req.query;
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

    await prisma.companiesAccounts.update({
      where: { id: Number(company) },
      data: dataToUpdate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};
