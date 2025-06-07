import axiosInstance from "../../config/axios.config";

export const takeawayAPI = {
  //getAllTakeawayOrders: () => {
  //    return axiosInstance.get('/takeaway');
  //},

  createTakeawayOrder: (data) => {
    return axiosInstance.post("/takeaway/create", data);
  },

  updateTakeawayOrder: (data) => {
    return axiosInstance.patch("/takeaway/update", data);
  },

  //deleteTakeawayOrder: (data) => {
  //    return axiosInstance.delete('/takeaway/delete', { data });
  //},

  //searchTakeawayOrder: (criteria) => {
  //    return axiosInstance.get('/takeaway/search', { params: criteria });
  //}
};
