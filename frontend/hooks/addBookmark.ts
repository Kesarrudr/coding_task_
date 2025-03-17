import { axiosPostRequest } from "@/axios/axios.config";
import { StatusEnum } from "@/types/types";
import { BookMarkReturnDataType } from "backend/utilis";
import { useState } from "react";

const useBookMarkHook = () => {
  const [isLoading, setIsloading] = useState<boolean>(false);

  const setBookmark = async (contestId: string) => {
    try {
      setIsloading(true);

      const response = await axiosPostRequest<string, BookMarkReturnDataType>(
        `user/bookmark?contestId=${contestId}`,
      );

      if (response.status === StatusEnum.success) {
        return response.data;
      }
    } finally {
      setIsloading(false);
    }
  };

  return { isLoading, setBookmark };
};

export { useBookMarkHook };
