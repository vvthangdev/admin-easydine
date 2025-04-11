
import axiosInstance from "../../config/axios.config";

export const contactAPI = {
    sendContact: (data) => {
        return axiosInstance.post('/contact/create', data); // Đảm bảo rằng bạn đã tạo route này trong backend
    },
    getALlContact: () => {
        return axiosInstance.get('/contact/getAll', ); // Đảm bảo rằng bạn đã tạo route này trong backend
    },


};