import React from "react";
import { Typography, Grid, Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import moment from "moment";
import { getVietnameseStatus } from "./TableCardUtils";

const TableCardDetails = ({ orderData, customerInfo, staffName }) => {
  if (!orderData) {
    return <Typography>Không có thông tin đơn hàng.</Typography>;
  }

  if (!orderData.order) {
    return <Typography>Thông tin đơn hàng không hợp lệ.</Typography>;
  }

  const totalAmount =
    orderData.itemOrders?.reduce(
      (acc, item) => acc + (item.itemPrice || 0) * (item.quantity || 0),
      0
    ) || 0;
  const vat = totalAmount * 0.1;
  const grandTotal = totalAmount + vat;

  return (
    <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
      {/* Left Column: Order Info and Reserved Tables */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Thông Tin Đơn Hàng
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Mã Đơn Hàng:</strong> #{orderData.order.id.slice(-4)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Tên Khách Hàng:</strong> {customerInfo.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Ngày:</strong>{" "}
              {moment.utc(orderData.order.time).local().format("DD/MM/YYYY")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Số Điện Thoại:</strong> {customerInfo.phone}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Thời gian bắt đầu:</strong>{" "}
              {orderData.reservedTables?.[0]?.start_time
                ? moment.utc(orderData.reservedTables[0].start_time).local().format("HH:mm")
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Địa Chỉ:</strong> {customerInfo.address}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Thời gian kết thúc:</strong>{" "}
              {orderData.reservedTables?.[0]?.end_time
                ? moment.utc(orderData.reservedTables[0].end_time).local().format("HH:mm")
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Loại:</strong> {orderData.order.type}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Trạng Thái:</strong> {getVietnameseStatus(orderData.order.status)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Nhân viên phục vụ:</strong> {staffName}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Danh Sách Bàn Đặt
        </Typography>
        {orderData.reservedTables?.length > 0 ? (
          <List>
            {orderData.reservedTables.map((table) => (
              <ListItem key={table._id}>
                <ListItemText
                  primary={`Bàn: ${table.table_id}`}
                  secondary={
                    table.start_time && table.end_time
                      ? `${moment
                          .utc(table.start_time)
                          .local()
                          .format("HH:mm, DD/MM/YYYY")} - ${moment
                          .utc(table.end_time)
                          .local()
                          .format("HH:mm, DD/MM/YYYY")}`
                      : "N/A"
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">Không có bàn đặt nào.</Typography>
        )}
      </Box>

      {/* Right Column: Item Orders and Total Bill */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Danh Sách Mặt Hàng
        </Typography>
        <Box sx={{ maxHeight: "50vh", overflowY: "auto", pr: 1, mb: 3 }}>
          {orderData.itemOrders?.length > 0 ? (
            <Grid container spacing={2}>
              {orderData.itemOrders.map((item) => (
                <Grid item xs={12} sm={6} key={item._id}>
                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "box-shadow 0.3s",
                      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.2)" },
                    }}
                  >
                    <img
                      src={item.itemImage || "https://via.placeholder.com/80"}
                      alt={item.itemName || "Item"}
                      style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", marginRight: 12 }}
                    />
                    <Box>
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
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2">Không có mặt hàng nào được đặt.</Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Tính Tổng Hóa Đơn
        </Typography>
        <Box>
          <Typography variant="body2">
            <strong>Tổng Tiền:</strong> {totalAmount.toLocaleString()} VND
          </Typography>
          <Typography variant="body2">
            <strong>VAT (10%):</strong> {vat.toLocaleString()} VND
          </Typography>
          <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>
            <strong>Tổng Cộng:</strong> {grandTotal.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TableCardDetails;