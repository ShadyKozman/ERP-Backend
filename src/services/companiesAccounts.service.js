import prisma from "../config/database.js";

/* -------------------Tested Successfully-------------------*/
export const getCompanies = async () => {
  try {
    const companies = await prisma.companiesAccounts.findMany({
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

        // Get isActive for each user so we can count
        UsersAccounts: {
          select: { isActive: true },
        },
      },
    });

    // Add counts
    return companies.map((c) => ({
      ...c,
      activeUsersCount: c.UsersAccounts.filter((u) => u.isActive).length,
      inactiveUsersCount: c.UsersAccounts.filter((u) => !u.isActive).length,
    }));
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addCompany = async (req) => {
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

    await prisma.companiesAccounts.create({
      data: dataToCreate,
    });

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchCompany = async (req) => {
  try {
    const { body, currentUser } = req;
    const { company, ...bodyData } = body;

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
