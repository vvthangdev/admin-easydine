import axiosInstance from "../../config/axios.config";

export const adminAPI = {
  updateUser: (id, data) => {
    return axiosInstance.patch(`/admin/update-user/${id}`, data);
  },

  deleteUser: (username) => {
    return axiosInstance.delete("/admin/delete-user", username);
  },

  getCustomerDetails: (customerId) => {
    return axiosInstance.get(`/admin/customer?id=${customerId}`);
  },
};
