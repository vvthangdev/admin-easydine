import axiosInstance from "../../config/axios.config";

export const tableAPI = {
  getAllTable: (data) => {
    return axiosInstance.get("/tables");
  },

  addTable: (data) => {
    return axiosInstance.post("/tables/create-table", data);
  },

  updateTable: (data) => {
    return axiosInstance.patch("/tables/update-table", data);
  },

  deleteTable: (data) => {
    return axiosInstance.delete("/tables/delete-table", { data });
  },
  getAllTablesStatus: (data) => {
    return axiosInstance.get("/tables/tables-status")
  },
  releaseTable: (data) => {
    return axiosInstance.post("/tables/release-table", data);
  },
  getAvailableTables: async (params) => {
    try {
      const response = await axiosInstance.get("/tables/available-tables", {
        params: {
          start_time: params.start_time,
          end_time: params.end_time,
        },
      });
      console.log("Available Tables API Response:", response); // Kiểm tra phản hồi API
      return response; // Trả về dữ liệu
    } catch (error) {
      console.error("Error fetching available tables:", error);
      throw error; // Ném lỗi nếu có
    }
  },
};
