import axiosInstance from "../../config/axios.config";

export const voucherAPI = {
  getAllVouchers: () => 
    axiosInstance.get("/vouchers/all").then((res) => res), // Không dùng res.data

  getVoucherByCode: (code) =>
    axiosInstance
      .get("/vouchers", { params: { code } })
      .then((res) => res), // Không dùng res.data

  getVoucherById: (id) =>
    axiosInstance.get(`/vouchers/${id}`).then((res) => res), // Không dùng res.data

  createVoucher: (data) =>
    axiosInstance.post("/vouchers", data).then((res) => res), // Không dùng res.data

  updateVoucher: (id, data) =>
    axiosInstance.patch(`/vouchers/${id}`, data).then((res) => res), // Không dùng res.data

  deleteVoucher: (id) =>
    axiosInstance.delete(`/vouchers/${id}`).then((res) => res), // Không dùng res.data

  addUsersToVoucher: (id, userIds) =>
    axiosInstance
      .post(`/vouchers/${id}/users`, { userIds })
      .then((res) => res), // Không dùng res.data

  removeUsersFromVoucher: (id, userIds) =>
    axiosInstance
      .delete(`/vouchers/${id}/users`, { userIds })
      .then((res) => res), // Không dùng res.data
};