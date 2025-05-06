import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const authAPI = {
  register: (data) => axiosInstance.post("/users/signup", data).then(handleApiResponse),
  login: (data) => axiosInstance.post("/users/login", data).then(handleApiResponse),
  logout: () => axiosInstance.post("/users/logout").then(handleApiResponse),
  refreshToken: () => axiosInstance.post("/users/refresh-token").then(handleApiResponse),
};

export const userAPI = {
  updateProfile: (data) => axiosInstance.put("/users/update-user", data).then(handleApiResponse),
  deleteAccount: (password) => axiosInstance.delete("/users/delete", { data: { password } }).then(handleApiResponse),
};
