interface UserInputData {
  username: string;
  password: string;
}
enum PlatFormEnum {
  CodeForces = "CodeForces",
  LeetCode = "LeetCode",
  CodeChef = "CodeChef",
  all = "all",
}
enum StatusEnum {
  success = "success",
  error = "error",
}

export { type UserInputData, StatusEnum, PlatFormEnum };
