// import { useEffect } from 'react';
// import { orderAPI } from '../../services/apis/Order';
// import { message } from 'antd';

// const TestRefreshToken = () => {
//   useEffect(() => {
//     const testRefresh = async () => {
//       try {
//         const accessToken = localStorage.getItem('accessToken');
//         const refreshToken = localStorage.getItem('refreshToken');

//         if (!accessToken || !refreshToken) {
//           message.error('Thiếu accessToken hoặc refreshToken. Vui lòng đăng nhập lại.');
//           window.location.href = '/login';
//           return;
//         }

//         localStorage.setItem('accessToken', 'invalid_token');

//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         const orders = await orderAPI.getAllOrders();
//         message.success('Refresh token thành công!');
//       } catch (error) {
//         message.error('Lỗi khi kiểm tra refresh token: ' + error.message);
//       }
//     };

//     testRefresh();
//   }, []);

//   return <div>Check console and network tab for refresh token test results</div>;
// };

// export default TestRefreshToken;