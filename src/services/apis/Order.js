// import { data } from "autoprefixer";
import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const orderAPI = {
  getAllOrders: () => axiosInstance.get("/orders").then(handleApiResponse),

  createOrder: (orderData) => axiosInstance.post("/orders/create-order", orderData).then(handleApiResponse),

  updateOrder: (data) => axiosInstance.patch("/orders/update-order", data).then(handleApiResponse),

  getAllOrdersInfo: () => axiosInstance.get("/orders/all-order-info").then(handleApiResponse),

  addItem: (data) => axiosInstance.post("/item/create-item", data).then(handleApiResponse),

  updateItem: (data) => axiosInstance.patch("/item/update-item", data).then(handleApiResponse),

  deleteItem: (data) => axiosInstance.delete("/item/delete-item", { data }).then(handleApiResponse),

  searchItem: (data) => axiosInstance.get("/item/search", { params: data }).then(handleApiResponse),

  deleteOrder: (id) => axiosInstance.delete(`/orders/delete-order/${id}`).then(handleApiResponse),

  confirmOrder: (orderId) => axiosInstance.post("/orders/confirm-order", { order_id: orderId }).then(handleApiResponse),

  searchOrdersByCustomer: (customerId) => axiosInstance.get("/orders/search-by-customer", {
    params: { customer_id: customerId },
  }).then(handleApiResponse),

  splitOrder: (data) => axiosInstance.post("/orders/split-order", data).then(handleApiResponse),

  mergeOrder: (data) => axiosInstance.post("/orders/merge-order", data).then(handleApiResponse),

  getOrderInfo: (data) => axiosInstance.get("/orders/order-info", { params: data }).then(handleApiResponse),
};
