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
    // const response = axios.post(`${API_URL}/release-table`, data, {
    //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    // });
    // return response.data;
  }
};
