import { Response } from "express";
import {
  AppError,
  asyncHandler,
  BookMarkQuery,
  BookMarkQueryType,
  checkUser,
  ContestQuerySchema,
  ContestQueryType,
  createNewUser,
  CustomRequest,
  getContestData,
  sendResponse,
  StatusCode,
  StatusEnum,
  updateBookMark,
  UserSignInSchema,
  UserSignInType,
  UserSignUpSchema,
  UserSignUpType,
} from "../utilis";
import { SafeParseReturnType } from "zod";

const SignUp = asyncHandler(async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const parseData: SafeParseReturnType<any, UserSignUpType> =
    UserSignUpSchema.safeParse(body);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const user = await createNewUser(parseData.data);

  sendResponse(
    res,
    StatusCode.OK,
    StatusEnum.success,
    "User Registerd Successfully",
    user,
  );
});

const SignIn = asyncHandler(async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const parseData: SafeParseReturnType<any, UserSignInType> =
    UserSignInSchema.safeParse(body);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const authToken = await checkUser(parseData.data);

  sendResponse(res, StatusCode.OK, StatusEnum.success, "AuthToken", authToken);
});

const BookMark = asyncHandler(async (req: CustomRequest, res: Response) => {
  const queryData = req.query;
  const { id: userId } = req.userData;

  const parseData: SafeParseReturnType<any, BookMarkQueryType> =
    BookMarkQuery.safeParse(queryData);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const update = await updateBookMark(userId, parseData.data.contestId);

  sendResponse(
    res,
    StatusCode.OK,
    StatusEnum.success,
    "BookMarkUpdated",
    update,
  );
});

const ContestData = asyncHandler(async (req: CustomRequest, res: Response) => {
  const queryData = req.query;

  const parseData: SafeParseReturnType<any, ContestQueryType> =
    ContestQuerySchema.safeParse(queryData);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const userData = req.userData;

  const result = await getContestData(userData.id, parseData.data.pageno);

  sendResponse(res, StatusCode.OK, StatusEnum.success, "Contest Data", result);
});

export { SignUp, SignIn, BookMark, ContestData };
