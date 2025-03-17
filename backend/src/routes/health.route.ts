import { Response, Request } from "express";
import { AppError, asyncHandler, sendResponse, StatusEnum } from "../utilis";

const HealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const isHealthy: boolean = true; //check the health

  if (!isHealthy) {
    throw new AppError("Server is not fine ❌", 503);
  }

  sendResponse(res, 200, StatusEnum.success, "Everything is fine 👍");
});

export { HealthCheck };
