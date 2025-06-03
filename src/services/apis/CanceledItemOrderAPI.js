import axiosInstance from "../../config/axios.config";
import { handleApiResponse } from "./handleApiResponse";

export const canceledItemOrderAPI = {
  getAllCanceledItemOrders: () => 
    axiosInstance.get("/canceled-item-orders").then(handleApiResponse),

  createCanceledItemOrder: (data) => 
    axiosInstance.post("/canceled-item-orders", data).then(handleApiResponse),

  getCanceledItemOrderById: (id) => 
    axiosInstance.get(`/canceled-item-orders/${id}`).then(handleApiResponse),

  updateCanceledItemOrder: (id, data) => 
    axiosInstance.patch(`/canceled-item-orders/${id}`, data).then(handleApiResponse),

  deleteCanceledItemOrder: (id) => 
    axiosInstance.delete(`/canceled-item-orders/${id}`).then(handleApiResponse),
};