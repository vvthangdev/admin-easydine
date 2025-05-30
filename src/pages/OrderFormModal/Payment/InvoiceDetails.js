import React, { forwardRef } from "react";
import { Typography, Box } from "@mui/material";
import moment from "moment";

const InvoiceDetails = forwardRef(({ orderDetails, customerInfo, staffInfo }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        gap: 3,
        mt: 3,
        '@media print': { flexDirection: 'column', gap: 2, padding: '20px', border: '1px solid #000', pageBreakInside: 'avoid' },
      }}
    >
      {/* Left Column: Order Info and Reserved Tables */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ '@media print': { fontSize: '16pt' } }}
          >
            Thông Tin Đơn Hàng
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1, '@media print': { gridTemplateColumns: '1fr', fontSize: '10pt' } }}>
            <Typography variant="body2">
              <strong>Mã Đơn Hàng:</strong> {orderDetails.order?.id || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Tên Khách Hàng:</strong> {customerInfo.name}
            </Typography>
            <Typography variant="body2">
              <strong>Ngày:</strong>{" "}
              {orderDetails.order?.time
                ? moment.utc(orderDetails.order.time).local().format("DD/MM/YYYY")
                : "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Số Điện Thoại:</strong> {customerInfo.phone}
            </Typography>
            <Typography variant="body2">
              <strong>Thời gian bắt đầu:</strong>{" "}
              {orderDetails.reservedTables?.[0]?.start_time
                ? moment.utc(orderDetails.reservedTables[0].start_time).local().format("HH:mm")
                : "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Địa Chỉ:</strong> {customerInfo.address}
            </Typography>
            <Typography variant="body2">
              <strong>Thời gian kết thúc:</strong>{" "}
              {orderDetails.reservedTables?.[0]?.end_time
                ? moment.utc(orderDetails.reservedTables[0].end_time).local().format("HH:mm")
                : "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Loại:</strong> {orderDetails.order?.type || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Trạng Thái:</strong> {orderDetails.order?.status || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Nhân viên phục vụ:</strong> {staffInfo.name}
            </Typography>
            <Typography variant="body2">
              <strong>Mã Voucher:</strong> {orderDetails.order?.voucher_code || "Không có"}
            </Typography>
            <Typography variant="body2">
              <strong>Phương thức thanh toán:</strong>{" "}
              {orderDetails.order?.payment_method || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ '@media print': { fontSize: '16pt' } }}
          >
            Danh Sách Bàn Đặt
          </Typography>
          {orderDetails.reservedTables?.length > 0 ? (
            <ul style={{ paddingLeft: 20, listStyleType: "disc", '@media print': { paddingLeft: 10, fontSize: '10pt' } }}>
              {orderDetails.reservedTables.map((table) => (
                <li key={table.table_id}>
                  <Typography variant="body2">
                    <strong>Bàn:</strong> {table.table_number || "N/A"} (Khu vực: {table.area || "N/A"}, Sức chứa: {table.capacity || "N/A"}),{" "}
                    <strong>Thời gian:</strong>{" "}
                    {table.start_time && table.end_time
                      ? `${moment.utc(table.start_time).local().format("HH:mm, DD/MM/YYYY")} - ${moment
                          .utc(table.end_time)
                          .local()
                          .format("HH:mm, DD/MM/YYYY")}`
                      : "N/A"}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có bàn đặt nào.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right Column: Item List and Total */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ maxHeight: "50vh", overflowY: "auto", pr: 2, '@media print': { maxHeight: 'none', overflow: 'visible' } }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ '@media print': { fontSize: '16pt' } }}
          >
            Danh Sách Mặt Hàng
          </Typography>
          {orderDetails.itemOrders?.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1, '@media print': { gridTemplateColumns: '1fr', fontSize: '10pt' } }}>
              {orderDetails.itemOrders.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 1,
                    p: 2,
                    bgcolor: "white",
                    boxShadow: 1,
                    "&:hover": { boxShadow: 2 },
                    '@media print': { border: 'none', boxShadow: 'none', p: 1 },
                  }}
                >
                  <Box sx={{ width: 64, height: 64, mr: 2, '@media print': { display: 'none' } }}>
                    <img
                      src={item.itemImage || "https://via.placeholder.com/80"}
                      alt={item.itemName || "Item"}
                      style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="body2">
                      <strong>Tên:</strong> {item.itemName || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Kích thước:</strong> {item.size || "Mặc định"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ghi chú:</strong> {item.note || "Không có"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Giá:</strong>{" "}
                      {item.itemPrice ? item.itemPrice.toLocaleString() : "N/A"} VND
                    </Typography>
                    <Typography variant="body2">
                      <strong>Số Lượng:</strong> {item.quantity || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tổng Tiền:</strong>{" "}
                      {item.itemPrice && item.quantity
                        ? (item.itemPrice * item.quantity).toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có mặt hàng nào được đặt.
            </Typography>
          )}
        </Box>

        <Box sx={{ borderTop: "1px solid", borderColor: "grey.200", pt: 2, '@media print': { borderTop: '1px solid black' } }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ '@media print': { fontSize: '16pt' } }}
          >
            Tính Tổng Hóa Đơn
          </Typography>
          <Box sx={{ mt: 1, '@media print': { fontSize: '10pt' } }}>
            <Typography variant="body2">
              <strong>Tổng Tiền:</strong>{" "}
              {orderDetails.order?.total_amount?.toLocaleString() || "0"} VND
            </Typography>
            <Typography variant="body2">
              <strong>Giảm giá ({orderDetails.order?.voucher_code || "Không có"}):</strong>{" "}
              {orderDetails.order?.discount_amount?.toLocaleString() || "0"} VND
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary" sx={{ '@media print': { color: 'black' } }}>
              <strong>Tổng Cộng:</strong>{" "}
              {orderDetails.order?.final_amount?.toLocaleString() || "0"} VND
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default InvoiceDetails;