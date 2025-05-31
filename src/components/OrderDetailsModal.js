import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Button,
  Modal,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { X } from "lucide-react";
import { orderAPI } from "../services/apis/Order";

export default function OrderDetailsModal({ open, onClose, orderId }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && orderId) {
      const fetchOrderDetails = async () => {
        console.log(orderId);
        setLoading(true);
        try {
          const response = await orderAPI.getOrderInfo({ id: orderId });
          setOrderDetails(response);
          console.log("[OrderDetailsModal] Dữ liệu chi tiết đơn hàng:", response);
        } catch (err) {
          setError(err.message);
          console.error("[OrderDetailsModal] Lỗi khi lấy chi tiết đơn hàng:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [open, orderId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="order-details-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000, // Đảm bảo z-index cao để tránh bị che
      }}
    >
      <Paper
        sx={{
          p: 3,
          minWidth: { xs: 300, sm: 400 },
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: 4,
          bgcolor: "#ffffff",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Chi Tiết Đơn Hàng
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#6e6e73" }}>
            <X size={20} />
          </IconButton>
        </Stack>

        {loading && (
          <Typography variant="body2" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error">
            Lỗi: {error}
          </Typography>
        )}
        {orderDetails && !loading && !error && (
          <Stack spacing={2}>
            {/* Thông tin đơn hàng */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Thông Tin Đơn Hàng
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <strong>ID Đơn Hàng:</strong> {orderDetails.order.id}
              </Typography>
              <Typography variant="body2">
                <strong>Loại:</strong> {orderDetails.order.type}
              </Typography>
              <Typography variant="body2">
                <strong>Trạng Thái:</strong> {orderDetails.order.status}
              </Typography>
              <Typography variant="body2">
                <strong>Thời Gian:</strong>{" "}
                {new Date(orderDetails.order.time).toLocaleString("vi-VN")}
              </Typography>
              <Typography variant="body2">
                <strong>Tổng Tiền:</strong>{" "}
                {orderDetails.order.total_amount.toLocaleString("vi-VN")} VNĐ
              </Typography>
              <Typography variant="body2">
                <strong>Giảm Giá:</strong>{" "}
                {orderDetails.order.discount_amount.toLocaleString("vi-VN")} VNĐ
              </Typography>
              <Typography variant="body2">
                <strong>Tiền Cuối Cùng:</strong>{" "}
                {orderDetails.order.final_amount.toLocaleString("vi-VN")} VNĐ
              </Typography>
            </Box>

            {/* Thông tin bàn đặt */}
            {orderDetails.reservedTables &&
              orderDetails.reservedTables.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Bàn Đặt
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {orderDetails.reservedTables.map((table) => (
                    <Box key={table.table_id}>
                      <Typography variant="body2">
                        <strong>Số Bàn:</strong> {table.table_number} (
                        {table.area})
                      </Typography>
                      <Typography variant="body2">
                        <strong>Sức Chứa:</strong> {table.capacity} người
                      </Typography>
                      <Typography variant="body2">
                        <strong>Trạng Thái:</strong> {table.status}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Thời Gian Bắt Đầu:</strong>{" "}
                        {new Date(table.start_time).toLocaleString("vi-VN")}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Thời Gian Kết Thúc:</strong>{" "}
                        {new Date(table.end_time).toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

            {/* Danh sách món ăn */}
            {orderDetails.itemOrders && orderDetails.itemOrders.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Món Ăn
                </Typography>
                <Divider sx={{ my: 1 }} />
                <List>
                  {orderDetails.itemOrders.map((item) => (
                    <ListItem key={item._id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={item.itemImage}
                          alt={item.itemName}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.itemName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Số lượng: {item.quantity}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Giá: {item.itemPrice.toLocaleString("vi-VN")} VNĐ
                            </Typography>
                            {item.note && (
                              <>
                                <br />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Ghi chú: {item.note}
                                </Typography>
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Stack>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={onClose} // Gọi onClose từ props
            variant="contained"
            sx={{
              borderRadius: 20,
              textTransform: "none",
              bgcolor: "#1c1c1e",
              "&:hover": { bgcolor: "#333336" },
            }}
          >
            Đóng
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}