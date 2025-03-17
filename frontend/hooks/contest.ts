import { axiosGetRequest } from "@/axios/axios.config";
import { PlatFormEnum, StatusEnum } from "@/types/types";
import { ContestReturnDataType } from "backend/utilis";
import { useState } from "react";

const useContesthook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getContest = async (pageNo: number, platform?: PlatFormEnum) => {
    try {
      setIsLoading(true);

      const response = await axiosGetRequest<ContestReturnDataType>(
        platform && platform != PlatFormEnum.all
          ? `user/contest?pageno=${pageNo}&platfrom=${platform}`
          : `user/contest?pageno=${pageNo}`,
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
