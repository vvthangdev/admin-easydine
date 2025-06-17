# EasyDine Admin Frontend

![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.17.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**EasyDine Admin Frontend** là giao diện quản trị viên cho ứng dụng EasyDine, được xây dựng bằng **React**. Hướng dẫn này giúp bạn cài đặt và chạy Admin Frontend trên máy local (Windows, macOS, hoặc Linux) mà không cần Docker. Mã nguồn được giả định đã giải nén từ file zip.

## Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Kiểm Tra Kết Quả](#kiểm-tra-kết-quả)
- [Lưu Ý](#lưu-ý)
- [Khắc Phục Lỗi](#khắc-phục-lỗi)

## Yêu Cầu Hệ Thống
- **Hệ điều hành**: Windows, macOS, hoặc Linux
- **Node.js**: Phiên bản 20.17.0
- **npm**: Đi kèm với Node.js
- **Trình chỉnh sửa văn bản**: VS Code hoặc tương tự

## Cài Đặt

1. **Cài Đặt Node.js**  
   Tải Node.js phiên bản 20.17.0 từ [nodejs.org](https://nodejs.org/dist/v20.17.0/) (chọn đúng phiên bản).  
   Kiểm tra phiên bản bằng lệnh:  
   node --version  
   npm --version  
   Đảm bảo Node.js phiên bản 20.17.0.

2. **Chuẩn Bị Mã Nguồn**  
   Giải nén file zip chứa mã nguồn vào một thư mục, ví dụ: `C:\admin-easydine` (Windows) hoặc `~/admin-easydine` (macOS/Linux).  
   Mở terminal và di chuyển vào thư mục:  
   cd /đường/dẫn/đến/admin-easydine

3. **Cài Đặt Phụ Thuộc**  
   Chạy lệnh để cài đặt các thư viện cần thiết (React, React-DOM, v.v.):  
   npm install

4. **Thiết Lập Biến Môi Trường**  
   Tạo file `.env` trong thư mục gốc (`admin-easydine`) và sao chép nội dung sau:  
   REACT_APP_BACKEND_URL=http://localhost:8080  
   REACT_APP_MINIO_API_URL=http://128.199.246.55:3001/upload  
   REACT_APP_QRCODE=https://img.vietqr.io/image/TIMO-0376688910-compact2.png  
   - Đảm bảo backend EasyDine đang chạy trên `http://localhost:8080` (theo hướng dẫn backend).  
   - `REACT_APP_MINIO_API_URL` sử dụng server từ xa (`128.199.246.55:3001`). Kiểm tra kết nối bằng lệnh `curl http://128.199.246.55:3001` hoặc trình duyệt.

## Chạy Ứng Dụng
Trong terminal, tại thư mục dự án, chạy:  
npm start  
Ứng dụng sẽ chạy trên `http://localhost:3000`.

## Kiểm Tra Kết Quả
1. Mở trình duyệt, truy cập `http://localhost:3000`.  
2. Kiểm tra console trình duyệt (F12 > Console) hoặc terminal để xem log lỗi.

## Lưu Ý
- **Backend**: Đảm bảo backend EasyDine chạy trước trên `http://localhost:8080`.
- **Mạng**: Kiểm tra kết nối đến MinIO server (`128.199.246.55:3001`) nếu dùng.
- **Script**: Kiểm tra file `package.json` để xác nhận script `start` tồn tại. Nếu không, thử `npm run dev`.
- **Lỗi phụ thuộc**: Nếu lỗi khi chạy `npm install`, xóa thư mục `node_modules` và file `package-lock.json`, rồi chạy lại.

## Khắc Phục Lỗi
- **Lỗi kết nối backend**: Đảm bảo backend chạy trên `http://localhost:8080`.
- **Lỗi MinIO**: Kiểm tra server `128.199.246.55:3001` hoạt động bằng `curl` hoặc trình duyệt.
- **Lỗi khác**: Cung cấp log lỗi từ console hoặc terminal để được hỗ trợ chi tiết.