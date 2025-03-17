import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { sendResponse, StatusEnum } from "../types";

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true; //false when database type opetations false.

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler: ErrorRequestHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  //WARNING: currenlty logs the custom apperror not the actual error
  // console.log(error); //Use Better Logging

  const statusCode = error.statusCode || 500;
  const message =
    error.isOperational && error.message
      ? error.message
      : "Internet Server Error";
  sendResponse(res, statusCode, StatusEnum.error, message);
};

export { errorHandler, AppError };
