import axiosInstance from "../../config/axios.config";
import { handleApiResponse } from "./handleApiResponse";

export const adminAPI = {
  // Cập nhật người dùng
  updateUser: (data) =>
    axiosInstance.patch("/admin/update", data).then(handleApiResponse),

  // Xóa người dùng
  deleteUser: (data) =>
    axiosInstance.delete("/admin/delete", { data }).then(handleApiResponse),

  // Lấy thông tin khách hàng
  getCustomerDetails: (customerId) =>
    axiosInstance
      .get(`/admin/customer?id=${customerId}`)
      .then(handleApiResponse),

  // Khóa người dùng
  deactivateUser: (data) =>
    axiosInstance.patch("/admin/deactivate", data).then(handleApiResponse),

  // Mở khóa người dùng
  activateUser: (data) =>
    axiosInstance.patch("/admin/activate", data).then(handleApiResponse),
};