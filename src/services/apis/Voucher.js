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
    return axiosInstance.post("/vouchers", data).then(handleApiResponse);
  },

  updateVoucher: (id, data) => {
    return axiosInstance.patch(`/vouchers/${id}`, data).then(handleApiResponse);
  },

  deleteVoucher: (id) => {
    return axiosInstance.delete(`/vouchers/${id}`).then(handleApiResponse);
  },

  addUsersToVoucher: (voucherId, userIds) => {
    return axiosInstance
      .post(`/vouchers/add/users`, { voucherId, userIds })
      .then(handleApiResponse);
  },

  removeUsersFromVoucher: (voucherId, userIds) => {
    return axiosInstance
      .delete(`/vouchers/delete/users`, { data: { voucherId, userIds } })
      .then(handleApiResponse);
  },

  applyVoucher: (voucherCode, orderId) => {
    return axiosInstance
      .post(`/vouchers/apply`, { voucherCode, orderId })
      .then(handleApiResponse);
  },
};