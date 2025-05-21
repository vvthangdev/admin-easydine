import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const userAPI = {
  getUserInfo: () => {
    return axiosInstance.get("/users/user-info").then(handleApiResponse);
  },

  getUserById: (id) => {
    return axiosInstance.get(`/users/${id}`).then(handleApiResponse);
  },

  getAllUser: () => {
    return axiosInstance.get("/users/all-users").then(handleApiResponse);
  },

  searchUsers: (query) => {
    return axiosInstance
      .get("/users/search", { params: { query } })
      .then(handleApiResponse);
  },

  updateUser: (user) => {
    return axiosInstance.patch("/users/update-user", user).then(handleApiResponse);
  },

  deleteUser: (data) => {
    return axiosInstance.delete("/users/delete", { data }).then(handleApiResponse);
  },
};
