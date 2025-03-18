import { PlatFromEnum, PrismaClient } from "@prisma/client";
import { UploadDataType } from "../types/types";

const prisma = new PrismaClient();

const getContestsData = async (platFrom: PlatFromEnum) => {
  try {
    const contests = await prisma.contest.findMany({
      where: {
        PlatFrom: platFrom,
      },
    });
    return contests;
  } catch (error) {
    console.log("error while getting contest", error);
  } finally {
    await prisma.$disconnect();
  }
};

const uploadDataQuery = async (data: UploadDataType[]) => {
  try {
    const update = await prisma.contestSolutions.createMany({
      data: data,
      skipDuplicates: true,
    });

    return update;
  } catch (error) {
    console.log("can't upload the data");
  } finally {
    await prisma.$disconnect();
  }
};

const noSoutionsContest = async () => {
  try {
    const data = await prisma.contest.findMany({
      where: {
        ContestSolutions: {
          none: {},
        },
      },
      select: {
        id: true,
        PlatFrom: true,
        contestName: true,
      },
    });

    return data;
  } catch (error) {
    console.log("Error while getting contests with no solutins:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export { getContestsData, uploadDataQuery, noSoutionsContest };
