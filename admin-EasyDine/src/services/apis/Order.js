import axiosInstance from "../../config/axios.config";

export const orderAPI = {
  getAllOrders: () => {
    return axiosInstance.get("/orders");
  },

  updateOrderStatus: async(id, status) => {
    try {
      const response = await axiosInstance.patch(`/orders/update-order-status`, {id, status});
      console.log("Raw API Response:", response); // Kiểm tra phản hồi API đầy đủ
      return response; // Đảm bảo trả về dữ liệu cần thiết từ response
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error; // Ném lỗi nếu có
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
  deleteOrder: (data) => {
    return axiosInstance.delete(`/orders/delete-order/${data}`);
  },
};
