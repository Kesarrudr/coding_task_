import { PlatFromEnum, Prisma } from "@prisma/client";
import { AppError, prisma, UploadSolutionArrayType } from "../functions";
import { StatusCode } from "../types";

const registerUser = async (username: string, hashPassword: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
      },
      select: {
        username: true,
      },
    });

    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new AppError(
          `User already exits with ${username} username. try some other username`,
          StatusCode.BAD_REQUEST,
        );
      }
    }

    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const findUser = async (username: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(
          `No user exits with ${username} username`,
          StatusCode.BAD_REQUEST,
        );
      }
    }

    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const bookMarkUpdate = async (userId: string, contestId: string) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingBookmark = await prisma.userBookMark.findUnique({
        where: {
          userId_contestId: { userId, contestId },
        },
      });

      if (existingBookmark) {
        await prisma.userBookMark.delete({
          where: { id: existingBookmark.id },
        });

        return { message: "Bookmark removed" };
      } else {
        await prisma.userBookMark.create({
          data: { userId, contestId },
        });

        return { message: "Bookmark added" };
      }
    });

    return result;
  } catch (error) {
    console.log("error", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(`Can't update the bookmark`, StatusCode.BAD_REQUEST);
    }

    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const solutionUpload = async (data: UploadSolutionArrayType) => {
  try {
    const update = await prisma.contestSolutions.createMany({
      data: data,
      skipDuplicates: true,
    });

    return update;
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(
        `Can't Upload the solution url`,
        StatusCode.BAD_REQUEST,
      );
    }

    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const contestData = async (
  userId: string,
  pageNo: string,
  platfrom?: PlatFromEnum,
) => {
  try {
    const data = await prisma.contest.findMany({
      where: {
        ...(platfrom && { PlatFrom: platfrom }),
      },
      skip: Number(pageNo) * 21,
      take: 21,
      include: {
        UserBookMark: {
          where: { userId },
          select: { id: true },
        },
        ContestSolutions: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        StartTime: "desc",
      },
    });

    const formattedData = data.map((contest) => ({
      ...contest,
      isBookmarked: contest.UserBookMark.length > 0,
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching contests:", error);
    throw new Error("Failed to fetch contest data.");
  }
};

export { registerUser, findUser, bookMarkUpdate, solutionUpload, contestData };
