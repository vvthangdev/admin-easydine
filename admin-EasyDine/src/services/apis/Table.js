import  axiosInstance from "../../config/axios.config"

export const tableAPI = {
    getAllTable: (data) => {
        return axiosInstance.get('/tables');
    },

    addTable: (data) => {
        return axiosInstance.post('/tables/create-table', data);
    },

    updateTable: (data) => {
        return axiosInstance.patch('/tables/update-table', data);
    },

    deleteTable: (data) => {
        return axiosInstance.delete('/tables/delete-table',{data});
    }
};

