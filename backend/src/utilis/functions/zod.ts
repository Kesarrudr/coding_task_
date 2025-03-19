import { PlatFromEnum } from "@prisma/client";
import z from "zod";
const UserSignUpSchema = z
  .object({
    username: z
      .string()
      .max(10, "Username can have maximun 10 chars")
      .nonempty("Username Required"),
    password: z
      .string()
      .nonempty("Password Required")
      .max(10, "Max 10 char")
      .min(6, "Minimun 6 char"),
  })
  .strict("Invalid request Body");

const UserSignInSchema = z
  .object({
    username: z.string().nonempty("Username Required"),
    password: z.string().nonempty("Password Required"),
  })
  .strict("Invalid request Body");

const BookMarkQuery = z.object({
  contestId: z.string().nonempty("Required contestId").uuid("Invalid Id"),
});

const UploadSolutionSchema = z.object({
  contestId: z.string().nonempty("Required ContestId"),
  url: z.string().url("Enter a valid url"),
  contestName: z.string().optional(),
});

const UploadSolutionArraySchema = z.array(UploadSolutionSchema);

const ContestQuerySchema = z.object({
  pageno: z.string().nonempty("Requied pageno"),
  platfrom: z
    .enum([
      PlatFromEnum.CodeForces,
      PlatFromEnum.LeetCode,
      PlatFromEnum.CodeChef,
    ])
    .optional(),
});

const ChangeSolutionSchema = z.object({
  contestId: z.string().nonempty("Required ContestID"),
  removeURLs: z.array(z.string()).optional(),
});

type UserSignUpType = z.infer<typeof UserSignUpSchema>;
type UserSignInType = z.infer<typeof UserSignInSchema>;
type BookMarkQueryType = z.infer<typeof BookMarkQuery>;
type UploadSolutionType = z.infer<typeof UploadSolutionSchema>;
type ContestQueryType = z.infer<typeof ContestQuerySchema>;
type UploadSolutionArrayType = z.infer<typeof UploadSolutionArraySchema>;
type ChangeSolutionType = z.infer<typeof ChangeSolutionSchema>;

export {
  ChangeSolutionSchema,
  ChangeSolutionType,
  UploadSolutionArrayType,
  UploadSolutionArraySchema,
  ContestQuerySchema,
  ContestQueryType,
  UploadSolutionSchema,
  UploadSolutionType,
  UserSignUpSchema,
  UserSignUpType,
  UserSignInSchema,
  UserSignInType,
  BookMarkQuery,
  BookMarkQueryType,
};
