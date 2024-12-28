import  axiosInstance from "../../config/axios.config"

export const adminAPI = {


    updateUser: (data) => {
        return axiosInstance.patch('/admin/update-user', data);
    },

    deleteUser: (username) => {
        return axiosInstance.delete('/admin/delete-user',username);
    }
};

