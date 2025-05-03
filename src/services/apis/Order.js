// import { data } from "autoprefixer";
import axiosInstance from "../../config/axios.config";

export const orderAPI = {
  getAllOrders: () => {
    return axiosInstance.get("/orders");
  },

  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(
        "/orders/create-order",
        orderData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateOrder: async (data) => {
    try {
      const response = await axiosInstance.patch("/orders/update-order", data); // Giả định endpoint PATCH /orders
      return response;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  getAllOrdersInfo: async () => {
    try {
      const response = await axiosInstance.get("/orders/all-order-info"); // Gọi API
      return response; // Trả về dữ liệu
    } catch (error) {
      console.error("Error fetching all order info:", error);
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  },

  getOrderDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/order-info`, {
        params: { id },
      });
      console.log("Raw API Response:", response); // Kiểm tra phản hồi API đầy đủ
      return response; // Đảm bảo trả về dữ liệu cần thiết từ response
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error; // Ném lỗi nếu có
    }
  },

  

  addItem: (data) => {
    return axiosInstance.post("/item/create-item", data);
  },

  updateItem: (data) => {
    return axiosInstance.patch("/item/update-item", data);
  },

  deleteItem: (data) => {
    return axiosInstance.delete("/item/delete-item", { data });
  },
  searchItem: (data) => {
    return axiosInstance.get("/item/delete-item");
  },
  deleteOrder: (id) => {
    return axiosInstance.delete(`/orders/delete-order/${id}`);
  },
  // Thêm hàm mới để xác nhận đơn hàng
  confirmOrder: async (orderId) => {
    try {
      const response = await axiosInstance.post("/orders/confirm-order", {
        order_id: orderId,
      });
      return response;
    } catch (error) {
      console.error("Error confirming order:", error);
      throw error;
    }
  },
  // Thêm hàm mới để tìm kiếm đơn hàng theo customer_id
  searchOrdersByCustomer: async (customerId) => {
    try {
      const response = await axiosInstance.get(
        `/orders/search-by-customer`,
        {
          params: { customer_id: customerId },
        }
      );
      return response;
    } catch (error) {
      console.error("Error searching orders by customer:", error);
      throw error;
    }
  },
  splitOrder: async (data) => {
    try {
      const response = await axiosInstance.post("/orders/split-order", data);
      console.log(`${response}`)
      return response;
    } catch (error) {
      console.error("Error splitting order:", error);
      throw error;
    }
  },
  mergeOrder: async (data) => {
    try {
      const response = await axiosInstance.post("/orders/merge-order", data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
};
