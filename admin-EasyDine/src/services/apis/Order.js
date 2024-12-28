import  axiosInstance from "../../config/axios.config"

export const orderAPI = {
    getAllOrders: () => {
        return axiosInstance.get('/orders');
    },

    addItem: (data) => {
        return axiosInstance.post('/item/create-item', data);
    },

    updateItem: (data) => {
        return axiosInstance.patch('/item/update-item', data);
    },

    deleteItem: (data) => {
        return axiosInstance.delete('/item/delete-item',{data});
    },
    searchItem: (data) => {
        return axiosInstance.get('/item/delete-item');
    }
};

