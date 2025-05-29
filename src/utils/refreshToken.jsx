import axiosInstance from '../config/axios.config';
import { handleApiResponse } from '../services/apis/handleApiResponse';

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Không tìm thấy refreshToken');
  }
  return axiosInstance
    .post(
      '/users/refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // Thêm Bearer
        },
      }
    )
    .then((response) => {
      const data = handleApiResponse(response); // { accessToken: "Bearer ..." }
      // Tách Bearer
      const cleanAccessToken = data.accessToken.replace(/^Bearer\s+/, '');
      return { accessToken: cleanAccessToken };
    });
};