import { axiosPostRequest } from "@/axios/axios.config";
import { StatusEnum } from "@/types/types";
import { ChangeSolutionType } from "backend/utilis";
import { useState } from "react";

const useRemoveSolution = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const removeSolution = async (removeData: ChangeSolutionType) => {
    try {
      setIsLoading(true);
      const response = await axiosPostRequest<ChangeSolutionType, null>(
        `admin/update`,
        removeData,
      );
      if (response.status === StatusEnum.success) {
        return response;
      } else {
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, removeSolution };
};

export { useRemoveSolution };
