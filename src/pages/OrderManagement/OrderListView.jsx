"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Calendar, Package, RefreshCw, Plus, X } from "lucide-react";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";
import OrderFormModal from "../OrderFormModal/OrderFormModalView";
import OrderTable from "./OrderTable";
import { message } from "antd";

const OrderListView = ({ selectedCustomer, onClearFilter }) => {
  const [orders, setOrders] = useState({ takeaway: [], reservation: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reservation");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const customerCache = useRef({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchOrders = useCallback(async (customerId = null) => {
    setLoading(true);
    try {
      const response = customerId
        ? await orderAPI.searchOrdersByCustomer(customerId)
        : await orderAPI.getAllOrders();
      const ordersData = response || [];

      const uniqueCustomerIds = [
        ...new Set(ordersData.map((order) => order.customer_id)),
      ];

      const customerDetailsPromises = uniqueCustomerIds.map(async (id) => {
        if (customerCache.current[id]) {
          return { id, data: customerCache.current[id] };
        }
        try {
          const customerResponse = await adminAPI.getCustomerDetails(id);
          customerCache.current[id] = customerResponse;
          return { id, data: customerResponse };
        } catch (error) {
          console.error(`Error fetching customer ${id}:`, error);
          return {
            id,
            data: { name: "Không xác định", phone: "Không xác định" },
          };
        }
      });

      const customerDetailsResults = await Promise.all(customerDetailsPromises);
      const customerMap = customerDetailsResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});

      const ordersWithCustomerDetails = ordersData.map((order) => ({
        ...order,
        id: order._id,
        customerName: customerMap[order.customer_id]?.name || "Không xác định",
        customerPhone:
          customerMap[order.customer_id]?.phone || "Không xác định",
        customerId: order.customer_id,
      }));

      const sortedOrders = ordersWithCustomerDetails.sort((a, b) =>
        moment(b.time).diff(moment(a.time))
      );
      setOrders({
        reservation: sortedOrders.filter(
          (order) => order.type === "reservation"
        ),
        takeaway: sortedOrders.filter((order) => order.type === "takeaway"),
      });
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
      setOrders({ takeaway: [], reservation: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(selectedCustomer?._id);
  }, [selectedCustomer, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      message.error("Dữ liệu trạng thái hoặc ID đơn hàng không hợp lệ");
      return;
    }

    try {
      const currentOrder =
        orders.reservation.find((o) => o.id === orderId) ||
        orders.takeaway.find((o) => o.id === orderId);

      if (!currentOrder) {
        try {
          const response = await orderAPI.getOrderInfo({ id: orderId });
          if (response && response.order) {
            const updatedOrderData = {
              id: orderId,
              status: newStatus,
              type: response.order.type,
            };
            await orderAPI.updateOrder(updatedOrderData);
            message.success("Cập nhật trạng thái thành công");
            fetchOrders(selectedCustomer?._id);
          } else {
            message.error("Không tìm thấy đơn hàng để cập nhật");
          }
        } catch (error) {
          console.error("Error fetching order info:", error);
          message.error("Không thể lấy thông tin đơn hàng");
        }
        return;
      }

      const updatedOrderData = {
        id: orderId,
        status: newStatus,
        type: currentOrder.type,
      };
      await orderAPI.updateOrder(updatedOrderData);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      let customerData;
      if (customerCache.current[customerId]) {
        customerData = customerCache.current[customerId];
      } else {
        customerData = await adminAPI.getCustomerDetails(customerId);
        customerCache.current[customerId] = customerData;
      }
      setCustomerDetails(customerData);
      setCustomerModalVisible(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      message.error("Không thể lấy thông tin chi tiết khách hàng");
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await orderAPI.deleteOrder(record.id);
      setOrders((prev) => ({
        ...prev,
        [record.type]: prev[record.type].filter(
          (order) => order.id !== record.id
        ),
      }));
      message.success(`Xóa đơn hàng ${record.id} thành công`);
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Xóa đơn hàng không thành công");
    }
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      if (orderData.id) {
        await orderAPI.updateOrder(orderData);
        message.success("Cập nhật đơn hàng thành công");
      } else {
        const response = await orderAPI.createOrder(orderData);
        if (!response || !response._id) {
          throw new Error("Invalid response: Order object not found");
        }
        const newOrder = response;
        setOrders((prev) => ({
          ...prev,
          [newOrder.type]: [
            ...prev[newOrder.type],
            {
              ...newOrder,
              id: newOrder._id,
              time: newOrder.time || newOrder.start_time,
              customerName: selectedCustomer?.name || "Không xác định",
              customerPhone: selectedCustomer?.phone || "Không xác định",
              customerId: selectedCustomer?._id,
            },
          ],
        }));
        message.success("Thêm đơn hàng thành công");
      }
      fetchOrders(selectedCustomer?._id);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding/updating order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1d1d1f",
            fontWeight: 700,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
          }}
        >
          Danh sách đơn hàng
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {selectedCustomer && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                px: 2,
                borderRadius: 2,
                background: "rgba(0, 113, 227, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography variant="body2" sx={{ color: "#1d1d1f" }}>
                Đang hiển thị đơn hàng của:{" "}
                <strong>{selectedCustomer.name}</strong> -{" "}
                {selectedCustomer.phone}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<X size={16} />}
                onClick={onClearFilter}
                disabled={loading}
                sx={{
                  ml: 1,
                  borderColor: "#86868b",
                  color: "#86868b",
                  borderRadius: 28,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#1d1d1f",
                    color: "#1d1d1f",
                    background: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          )}
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => fetchOrders(selectedCustomer?._id)}
            disabled={loading}
            sx={{
              borderColor: "#0071e3",
              color: "#0071e3",
              borderRadius: 28,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#0071e3",
                background: "rgba(0, 113, 227, 0.05)",
              },
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAdd}
            disabled={loading}
            sx={{
              background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
              color: "#ffffff",
              borderRadius: 28,
              boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Thêm đơn hàng mới
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            "& .MuiTabs-indicator": {
              backgroundColor: "#0071e3",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: "#86868b",
              "&.Mui-selected": {
                color: "#0071e3",
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab
            icon={<Calendar size={16} />}
            iconPosition="start"
            label="Đơn hàng đặt chỗ"
            value="reservation"
            sx={{ px: 3 }}
          />
          <Tab
            icon={<Package size={16} />}
            iconPosition="start"
            label="Đơn hàng giao hàng"
            value="takeaway"
            sx={{ px: 3 }}
          />
        </Tabs>

        <Box sx={{ flex: 1, overflow: "auto", p: 0 }}>
          <OrderTable
            orders={orders[activeTab]}
            loading={loading}
            onStatusChange={handleStatusChange}
            onViewCustomerDetails={handleViewCustomerDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            handleCopyOrderId={handleCopyOrderId}
          />
        </Box>
      </Box>

      <OrderFormModal
        visible={isModalVisible}
        editingOrder={editingOrder}
        selectedCustomer={selectedCustomer}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmitOrder}
        orders={orders}
      />

      <Dialog
        open={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            overflow: "hidden",
            maxWidth: 400,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background:
              "linear-gradient(145deg, rgba(0, 113, 227, 0.05) 0%, rgba(0, 113, 227, 0.1) 100%)",
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          Thông tin khách hàng
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {customerDetails ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar
                  src={
                    customerDetails.avatar || "https://via.placeholder.com/80"
                  }
                  alt={customerDetails.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1d1d1f", fontWeight: 600 }}
                  >
                    {customerDetails.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#86868b" }}>
                    {customerDetails.username || "Chưa cung cấp"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(0, 113, 227, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography variant="body2" sx={{ color: "#1d1d1f", mb: 1 }}>
                  <strong>Địa chỉ:</strong>{" "}
                  {customerDetails.address || "Chưa cung cấp"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#1d1d1f", mb: 1 }}>
                  <strong>Email:</strong>{" "}
                  {customerDetails.email || "Chưa cung cấp"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#1d1d1f" }}>
                  <strong>Số điện thoại:</strong>{" "}
                  {customerDetails.phone || "Chưa cung cấp"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#0071e3" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <Button
            onClick={() => setCustomerModalVisible(false)}
            sx={{
              borderColor: "#86868b",
              color: "#86868b",
              borderRadius: 28,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#1d1d1f",
                color: "#1d1d1f",
                background: "rgba(0, 0, 0, 0.05)",
              },
            }}
            variant="outlined"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Đã sao chép mã đơn hàng!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderListView;
