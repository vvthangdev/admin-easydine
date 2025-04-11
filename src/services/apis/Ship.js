import axiosInstance from "../../config/axios.config";

export const shipAPI = {
    //getAllShipOrders: () => {
    //    return axiosInstance.get('/ship');
    //},

    createShipOrder: (data) => {
        return axiosInstance.post('/ship/create', data);
    },

    updateShipOrder: (data) => {
        return axiosInstance.patch('/ship/update', data);
    },

    //deleteShipOrder: (data) => {
    //    return axiosInstance.delete('/ship/delete', { data });
    //},

    //searchShipOrder: (criteria) => {
    //    return axiosInstance.get('/ship/search', { params: criteria });
    //}
};