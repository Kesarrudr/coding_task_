import { axiosGetRequest } from "@/axios/axios.config";
import { StatusEnum } from "@/types/types";
import { ContestReturnDataType } from "backend/utilis";
import { useState } from "react";

const useContesthook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getContest = async (pageNo: number) => {
    try {
      setIsLoading(true);

      const response = await axiosGetRequest<ContestReturnDataType>(
        `user/contest?pageno=${pageNo}`,
      );
      if (response.status === StatusEnum.success) {
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getContest };
};

export { useContesthook };
