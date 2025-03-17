import { Request, Response } from "express";
import {
  checkUser,
  createNewUser,
  getContestData,
  updateBookMark,
  updateSolution,
} from "../functions";
import { JwtPayload } from "jsonwebtoken";

enum StatusEnum {
  success = "success",
  error = "error",
}

const sendResponse = (
  res: Response,
  statusCode: StatusCode,
  status: StatusEnum,
  message: string,
  data: any = null,
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

interface SendResponseType<T> {
  status: StatusEnum;
  message: String;
  data: T;
}

type UserSignUpReturnDateType = Awaited<ReturnType<typeof createNewUser>>;
type UserSignInReturnDataType = Awaited<ReturnType<typeof checkUser>>;
type UploadSolutionReturnDataType = Awaited<ReturnType<typeof updateSolution>>;
type ContestReturnDataType = Awaited<ReturnType<typeof getContestData>>;
type BookMarkReturnDataType = Awaited<ReturnType<typeof updateBookMark>>;
type ContestDataType = ContestReturnDataType[number];

interface CustomRequest extends Request {
  userData: {
    id: string;
    username: string;
  };
}

interface JWTTOKEN extends JwtPayload {
  id: string;
  username: string;
}

export {
  sendResponse,
  StatusEnum,
  StatusCode,
  SendResponseType,
  UserSignUpReturnDateType,
  UserSignInReturnDataType,
  type CustomRequest,
  type JWTTOKEN,
  type UploadSolutionReturnDataType,
  type ContestReturnDataType,
  type BookMarkReturnDataType,
  type ContestDataType,
};
