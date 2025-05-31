import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const tableAPI = {
  getAllTable: () =>
    axiosInstance.get("/tables").then(handleApiResponse),

  getTableById: (data) => axiosInstance.get("/tables/get-table", { params: data }).then(handleApiResponse),

  getAllAreas: async () => {
    const tables = await axiosInstance.get("/tables").then(handleApiResponse);
    const areas = [...new Set(tables.map((table) => table.area))];
    return areas;
  },

  addTable: (data) =>
    axiosInstance.post("/tables/create-table", data).then(handleApiResponse),

  updateTable: (data) =>
    axiosInstance.patch("/tables/update-table", data).then(handleApiResponse),

  deleteTable: (data) =>
    axiosInstance
      .delete("/tables/delete-table", { data })
      .then(handleApiResponse),

  getAllTablesStatus: () =>
    axiosInstance.get("/tables/tables-status").then(handleApiResponse),

  releaseTable: (data) =>
    axiosInstance.post("/tables/release-table", data).then(handleApiResponse),

  getAvailableTables: (params) =>
    axiosInstance
      .get("/tables/available-tables", {
        params: {
          start_time: params.start_time,
          end_time: params.end_time,
        },
      })
      .then(handleApiResponse),
};