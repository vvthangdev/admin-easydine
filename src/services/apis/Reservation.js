import axiosInstance from "../../config/axios.config";

export const reservationAPI = {
    createOrder: (data) => {
        return axiosInstance.post('/orders/create-order', data);
    },

    getAllReservations: (data) => {
        return axiosInstance.get('/orders');
    },

    updateReservation: (data) => {
        return axiosInstance.put('/orders/update/', data);
    },

    deleteReservation: (data) => {
        return axiosInstance.delete('/orders/delete/', data);
    }
};