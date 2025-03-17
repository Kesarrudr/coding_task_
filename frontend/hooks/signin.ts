import { axiosPostRequest } from "@/axios/axios.config";
import { StatusEnum, UserInputData } from "@/types/types";
import { UserSignInReturnDataType } from "backend/utilis";
import { useState } from "react";

const useSignInHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginUser = async (userdata: UserInputData) => {
    try {
      setIsLoading(true);

      const result = await axiosPostRequest<
        UserInputData,
        UserSignInReturnDataType
      >("/user/signin", userdata);
      if (result.status === StatusEnum.success) {
        return result.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, loginUser };
};

export { useSignInHook };
