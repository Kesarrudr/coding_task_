import { axiosPostRequest } from "@/axios/axios.config";
import { StatusEnum, UserInputData } from "@/types/types";
import { UserSignUpReturnDateType } from "backend/utilis";
import { useState } from "react";

const useSignUpHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerUser = async (userdata: UserInputData) => {
    try {
      setIsLoading(true);

      const result = await axiosPostRequest<
        UserInputData,
        UserSignUpReturnDateType
      >("/user/signup", userdata);
      console.log("response", result);
      if (result.status === StatusEnum.success) {
        return result.message;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, registerUser };
};

export { useSignUpHook };
