import { NextFunction, Response } from "express";

import jwt from "jsonwebtoken";
import {
  AppError,
  asyncHandler,
  CustomRequest,
  JWTTOKEN,
  StatusCode,
} from "../utilis";

const userAuthMiddleWare = asyncHandler(
  async (req: CustomRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization Header Missing", StatusCode.NOT_FOUND);
    }
    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");

      const decode = jwt.decode(token) as JWTTOKEN | null;

      if (!decode) {
        throw new AppError("Invalid Token", StatusCode.UNAUTHORIZED);
      }

      const { id: userId, username } = decode;

      req.userData = {
        id: userId,
        username: username,
      };

      next();
    } catch (error) {
      console.log("error", error);
      throw new AppError("UNAUTHORIZED", StatusCode.UNAUTHORIZED);
    }
  },
);

export { userAuthMiddleWare };
