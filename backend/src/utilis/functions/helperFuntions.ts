import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  bookMarkUpdate,
  contestData,
  findUser,
  registerUser,
  solutionUpload,
} from "../database";
import { StatusCode } from "../types";
import { AppError } from "./AppError";
import {
  UploadSolutionArrayType,
  UploadSolutionType,
  UserSignUpType,
} from "./zod";
import { PlatFromEnum } from "@prisma/client";

const createNewUser = async (userData: UserSignUpType) => {
  const hashpassowd = await bcrypt.hash(userData.password, 10);
  const user = await registerUser(userData.username, hashpassowd);
  return user;
};

const checkUser = async (userData: UserSignUpType) => {
  const userDetails = await findUser(userData.username);

  const checkPassword = await bcrypt.compare(
    userData.password,
    userDetails.password,
  );

  if (!checkPassword) {
    throw new AppError("Invalid Password", StatusCode.BAD_REQUEST);
  }

  const token = jwt.sign(
    { id: userDetails.id, username: userDetails.username },
    process.env.JWT_SECRET || "JWT_SECRET",
  );

  return { authToken: token };
};

const updateBookMark = async (userId: string, contastId: string) => {
  const update = await bookMarkUpdate(userId, contastId);

  return update;
};

const updateSolution = async (data: UploadSolutionArrayType) => {
  const response = await solutionUpload(data);

  return response;
};

const getContestData = async (
  userId: string,
  pageNo: string,
  platFrom?: PlatFromEnum,
) => {
  const result = await contestData(userId, pageNo, platFrom);
  return result;
};

export {
  checkUser,
  createNewUser,
  getContestData,
  updateBookMark,
  updateSolution,
};
