import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const adminAPI = {
  updateUser: (id, data) =>
    axiosInstance.patch(`/admin/update-user/${id}`, data).then(handleApiResponse),

  deleteUser: (username) =>
    axiosInstance
      .delete("/admin/delete-user", { data: { username } })
      .then(handleApiResponse),

  getCustomerDetails: (customerId) =>
    axiosInstance
      .get(`/admin/customer?id=${customerId}`)
      .then(handleApiResponse),
};