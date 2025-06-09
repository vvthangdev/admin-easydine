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
import { useAppleStyles } from "../../theme/theme-hooks";

const OrderListView = ({ selectedCustomer, onClearFilter }) => {
  const styles = useAppleStyles();
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
          mb: styles.spacing(3),
        }}
      >
        <Typography
          variant="h5"
          sx={{
            ...styles.components?.text?.heading,
            color: styles.colors?.text?.primary || "#1d1d1f",
          }}
        >
          Danh sách đơn hàng
        </Typography>
        <Box sx={{ display: "flex", gap: styles.spacing(2), alignItems: "center" }}>
          {selectedCustomer && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1),
                p: styles.spacing(1),
                px: styles.spacing(2),
                borderRadius: styles.rounded("md"),
                background: styles.colors?.primary?.[50] || "rgba(0, 113, 227, 0.05)",
                border: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
              }}
            >
              <Typography variant="body2" sx={{ color: styles.colors?.text?.primary || "#1d1d1f" }}>
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
                  ...styles.button("outline"),
                  borderRadius: styles.rounded("full"),
                  color: styles.colors?.text?.secondary || "#86868b",
                  borderColor: styles.colors?.neutral?.[200] || "#86868b",
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
              ...styles.button("outline"),
              borderRadius: styles.rounded("full"),
              color: styles.colors?.primary?.main || "#0071e3",
              borderColor: styles.colors?.primary?.main || "#0071e3",
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
              ...styles.button("primary"),
              borderRadius: styles.rounded("full"),
              boxShadow: styles.shadows?.sm,
            }}
          >
            Thêm đơn hàng mới
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          borderRadius: styles.rounded("lg"),
          background: styles.gradients?.light || "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
          boxShadow: styles.shadows?.sm,
          border: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
            "& .MuiTabs-indicator": {
              backgroundColor: styles.colors?.primary?.main || "#0071e3",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: styles.colors?.text?.secondary || "#86868b",
              "&.Mui-selected": {
                color: styles.colors?.primary?.main || "#0071e3",
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
            sx={{ px: styles.spacing(3) }}
          />
          <Tab
            icon={<Package size={16} />}
            iconPosition="start"
            label="Đơn hàng giao hàng"
            value="takeaway"
            sx={{ px: styles.spacing(3) }}
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
            borderRadius: styles.rounded("lg"),
            boxShadow: styles.shadows?.lg,
            background: styles.gradients?.light || "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            overflow: "hidden",
            maxWidth: 400,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: styles.spacing(3),
            background: styles.colors?.primary?.[50] || "rgba(0, 113, 227, 0.05)",
            color: styles.colors?.text?.primary || "#1d1d1f",
            fontWeight: 600,
            borderBottom: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
          }}
        >
          Thông tin khách hàng
        </DialogTitle>
        <DialogContent sx={{ p: styles.spacing(3), mt: styles.spacing(2) }}>
          {customerDetails ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: styles.spacing(2) }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: styles.spacing(3) }}>
                <Avatar
                  src={
                    customerDetails.avatar || "https://via.placeholder.com/80"
                  }
                  alt={customerDetails.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: styles.rounded("md"),
                    border: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
                    boxShadow: styles.shadows?.sm,
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: styles.colors?.text?.primary || "#1d1d1f", fontWeight: 600 }}
                  >
                    {customerDetails.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: styles.colors?.text?.secondary || "#86868b" }}>
                    {customerDetails.username || "Chưa cung cấp"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: styles.spacing(2),
                  p: styles.spacing(2),
                  borderRadius: styles.rounded("md"),
                  background: styles.colors?.primary?.[50] || "rgba(0, 113, 227, 0.05)",
                  border: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}`,
                }}
              >
                <Typography variant="body2" sx={{ color: styles.colors?.text?.primary || "#1d1d1f", mb: styles.spacing(1) }}>
                  <strong>Địa chỉ:</strong>{" "}
                  {customerDetails.address || "Chưa cung cấp"}
                </Typography>
                <Typography variant="body2" sx={{ color: styles.colors?.text?.primary || "#1d1d1f", mb: styles.spacing(1) }}>
                  <strong>Email:</strong>{" "}
                  {customerDetails.email || "Chưa cung cấp"}
                </Typography>
                <Typography variant="body2" sx={{ color: styles.colors?.text?.primary || "#1d1d1f" }}>
                  <strong>Số điện thoại:</strong>{" "}
                  {customerDetails.phone || "Chưa cung cấp"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: styles.spacing(4) }}>
              <CircularProgress sx={{ color: styles.colors?.primary?.main || "#0071e3" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: styles.spacing(3), borderTop: `1px solid ${styles.colors?.neutral?.[100] || "rgba(0, 0, 0, 0.05)"}` }}
        >
          <Button
            onClick={() => setCustomerModalVisible(false)}
            sx={{
              ...styles.button("outline"),
              borderRadius: styles.rounded("full"),
              color: styles.colors?.text?.secondary || "#86868b",
              borderColor: styles.colors?.neutral?.[200] || "#86868b",
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
          sx={{ width: "100%", borderRadius: styles.rounded("md") }}
        >
          Đã sao chép mã đơn hàng!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderListView;