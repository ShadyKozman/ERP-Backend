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

        usersAccounts: {
          select: { isActive: true, isDeleted: true },
        },

        companiesModules: {
          select: {
            Module: {
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

    return companies.map((c) => ({
      ...c,
      activeUsersCount: c.usersAccounts.filter((u) => u.isActive).length,
      deletedUsersCount: c.usersAccounts.filter((u) => u.isDeleted).length,
      inactiveUsersCount: c.usersAccounts.filter(
        (u) => !u.isActive && !u.isDeleted
      ).length,
    }));
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addCompany = async (req) => {
  try {
    const { body, currentUser } = req;
    const { modules, ...bodyData } = body;

    const dataToCreate = {
      ...bodyData,
      createdAt: new Date(),
      createdBy: currentUser.id,
    };

    Object.keys(dataToCreate).forEach(
      (key) => dataToCreate[key] === undefined && delete dataToCreate[key]
    );

    const createdCompany = await prisma.companiesAccounts.create({
      data: dataToCreate,
    });

    if (modules && modules.length > 0) {
      const data = modules.map((module) => ({
        company: createdCompany.id,
        module: module,
      }));

      await prisma.companiesModules.createMany({
        data,
        skipDuplicates: true,
      });
    }

    return [];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const patchCompany = async (req) => {
  try {
    const { body, currentUser } = req;
    const { company, modules, ...bodyData } = body;

    const dataToUpdate = {
      ...bodyData,
      deletedBy: null,
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: currentUser.id,
    };

    if (modules && modules.length > 0) {
      const data = modules.map((module) => ({
        company: company,
        module: module,
      }));

      await prisma.companiesModules.createMany({
        data,
        skipDuplicates: true,
      });
    }

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
