import { axiosPostRequest } from "@/axios/axios.config";
import { StatusEnum } from "@/types/types";
import {
  UploadSolutionArrayType,
  UploadSolutionReturnDataType,
} from "backend/utilis";
import { useState } from "react";

const useSolutionHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadsolution = async (data: UploadSolutionArrayType) => {
    try {
      setIsLoading(true);

      const response = await axiosPostRequest<
        UploadSolutionArrayType,
        UploadSolutionReturnDataType
      >("/admin/upload", data);
      if (response.status === StatusEnum.success) {
        return response;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, uploadsolution };
};

export { useSolutionHook };
