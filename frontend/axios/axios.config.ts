import { showErrorNotification } from "@/components/error-toast";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SendResponseType } from "backend/utilis/index";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BaseURL || "http://localhost:6969/api/v1",
});

axiosInstance.interceptors.request.use(async (config) => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error); // If error is not AxiosError, just reject it
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken"); // Clear token on unauthorized error
      window.location.href = "/signin"; // Redirect to sign-in page
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      "Some thing is wrong";

    showErrorNotification(message);

    return Promise.resolve(error);
  },
);

// API Request Functions (No Need for `try-catch`)
const axiosGetRequest = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  const response = await axiosInstance.get<SendResponseType<TResponse>>(
    url,
    config,
  );
  return response.data;
};

const axiosPostRequest = async <TRequest, TResponse>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  const response = await axiosInstance.post<SendResponseType<TResponse>>(
    url,
    data,
    config,
  );
  if (response instanceof AxiosError) {
    return response.response?.data;
  }
  return response.data;
};

export { axiosGetRequest, axiosPostRequest };
