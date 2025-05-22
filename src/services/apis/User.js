import axiosInstance from "../../config/axios.config";
import { handleApiResponse } from "./handleApiResponse";

export const userAPI = {
  // Lấy thông tin người dùng hiện tại
  getUserInfo: () => {
    return axiosInstance.get("/users/user-info").then(handleApiResponse);
  },

  // Lấy thông tin người dùng theo ID
  getUserById: (data) => {
    return axiosInstance.post("/users/user", data).then(handleApiResponse);
  },

  // Lấy tất cả người dùng
  getAllUser: () => {
    return axiosInstance.get("/users/all-users").then(handleApiResponse);
  },

  // Tìm kiếm người dùng
  searchUsers: (query) => {
    return axiosInstance
      .get("/users/search", { params: { query } })
      .then(handleApiResponse);
  },

  // Cập nhật người dùng
  updateUser: (user) => {
    return axiosInstance.patch("/users/update-user", user).then(handleApiResponse);
  },

  // Xóa người dùng
  deleteUser: (data) => {
    return axiosInstance.delete("/users/delete", { data }).then(handleApiResponse);
  },
};