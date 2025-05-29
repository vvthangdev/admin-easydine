import axiosInstance from "../../config/axios.config";
import { handleApiResponse } from "./handleApiResponse";

export const voucherAPI = {
  getAllVouchers: () => {
    return axiosInstance.get("/vouchers").then(handleApiResponse);
  },

  getVoucherByCode: (code) => {
    return axiosInstance
      .get(`/vouchers/code/${code}`)
      .then(handleApiResponse);
  },

  getVoucherById: (id) => {
    return axiosInstance.get(`/vouchers/${id}`).then(handleApiResponse);
  },

  createVoucher: (data) => {
    // Loại bỏ trùng lặp trong applicableUsers trước khi gửi
    if (data.applicableUsers && Array.isArray(data.applicableUsers)) {
      data.applicableUsers = [...new Set(data.applicableUsers)];
    }
    return axiosInstance.post("/vouchers", data).then(handleApiResponse);
  },

  updateVoucher: (id, data) => {
    // Loại bỏ trùng lặp trong applicableUsers trước khi gửi
    if (data.applicableUsers && Array.isArray(data.applicableUsers)) {
      data.applicableUsers = [...new Set(data.applicableUsers)];
    }
    return axiosInstance.patch(`/vouchers/${id}`, data).then(handleApiResponse);
  },

  deleteVoucher: (id) => {
    return axiosInstance.delete(`/vouchers/${id}`).then(handleApiResponse);
  },

  addUsersToVoucher: (voucherId, userIds) => {
    // Loại bỏ trùng lặp trong userIds trước khi gửi
    const uniqueUserIds = [...new Set(userIds)];
    return axiosInstance
      .post(`/vouchers/add/users`, { voucherId, userIds: uniqueUserIds })
      .then(handleApiResponse);
  },

  removeUsersFromVoucher: (voucherId, userIds) => {
    // Loại bỏ trùng lặp trong userIds trước khi gửi
    const uniqueUserIds = [...new Set(userIds)];
    return axiosInstance
      .delete(`/vouchers/delete/users`, { data: { voucherId, userIds: uniqueUserIds } })
      .then(handleApiResponse);
  },

  applyVoucher: (voucherCode, orderId) => {
    // Dùng cho CUSTOMER/STAFF (chỉ áp dụng cho đơn hàng của họ) hoặc ADMIN (bất kỳ đơn hàng nào)
    return axiosInstance
      .post(`/vouchers/apply`, { voucherCode, orderId })
      .then(handleApiResponse);
  },
};