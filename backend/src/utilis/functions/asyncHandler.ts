import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";

const asyncHandler = (
  reqHandler: (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

export { asyncHandler };
