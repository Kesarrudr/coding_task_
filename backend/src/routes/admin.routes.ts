import { Request, Response } from "express";
import {
  AppError,
  asyncHandler,
  sendResponse,
  StatusCode,
  StatusEnum,
  updateSolution,
  UploadSolutionArraySchema,
  UploadSolutionArrayType,
} from "../utilis";
import { SafeParseReturnType } from "zod";

const uploadSolution = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const parseData: SafeParseReturnType<any, UploadSolutionArrayType> =
    UploadSolutionArraySchema.safeParse(data);

  if (!parseData.success) {
    throw new AppError(
      parseData.error.errors[0].message,
      StatusCode.BAD_REQUEST,
    );
  }

  const filteredArray = parseData.data.map((contest) => ({
    contestId: contest.contestId,
    url: contest.url,
  }));

  const result = await updateSolution(filteredArray);

  sendResponse(
    res,
    StatusCode.OK,
    StatusEnum.success,
    "Solution Uploaded",
    result,
  );
});

export { uploadSolution };
