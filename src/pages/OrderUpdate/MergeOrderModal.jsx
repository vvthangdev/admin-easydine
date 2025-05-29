import React, { useState, useEffect } from "react";
import {
  Modal as MuiModal,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Box,
} from "@mui/material";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import moment from "moment";
import { toast } from "react-toastify";

const MergeOrderModal = ({ visible, targetOrder, onCancel, onSuccess, zIndex }) => {
  const [sourceOrderId, setSourceOrderId] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("MergeOrderModal rendered", { visible, targetOrder });
    if (!visible) return;

    const fetchTableStatus = async () => {
      setLoading(true);
      try {
        const tableStatus = await tableAPI.getAllTablesStatus();
        const reservedTables = tableStatus.filter(
          (table) =>
            (table.status === "Occupied" || table.status === "Reserved") &&
            table.reservation_id
        );
        const ordersByReservation = reservedTables.reduce((acc, table) => {
          const reservationId = table.reservation_id;
          if (!acc[reservationId]) {
            acc[reservationId] = {
              id: reservationId,
              tables: [],
              time: table.start_time,
            };
          }
          acc[reservationId].tables.push({
            table_number: table.table_number,
            area: table.area,
          });
          return acc;
        }, {});
        const orders = Object.values(ordersByReservation).filter(
          (order) => order.id !== targetOrder?.id && order.tables.length > 0
        );
        console.log("Available orders detailed:", orders);
        setAvailableOrders(orders);
      } catch (error) {
        toast.error("Không thể tải danh sách đơn hàng: " + (error.message || "Lỗi không xác định."));
      } finally {
        setLoading(false);
      }
    };

    fetchTableStatus();
  }, [visible, targetOrder?.id]);

  const handleMergeOrder = async () => {
    if (!sourceOrderId) {
      toast.error("Vui lòng chọn đơn hàng muốn gộp!");
      return;
    }
    if (!targetOrder?.id) {
      toast.error("Đơn hàng hiện tại chưa được lưu. Vui lòng lưu đơn hàng trước!");
      return;
    }

    setLoading(true);
    try {
      await orderAPI.mergeOrder({
        source_order_id: sourceOrderId,
        target_order_id: targetOrder.id,
      });
      toast.success(`Gộp đơn thành công! Đơn hàng đích: ${targetOrder.id}`);
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Gộp đơn thất bại: ${error.message || "Lỗi không xác định."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiModal
      open={visible}
      onClose={onCancel}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: zIndex || 1001 }}
    >
      <Box
        sx={{
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          mt: "50px",
        }}
      >
        <h2>Gộp Đơn Hàng</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Chọn Đơn Hàng Muốn Gộp</InputLabel>
            <MuiSelect
              value={sourceOrderId || ""}
              onChange={(e) => {
                console.log("Selected source order:", e.target.value);
                setSourceOrderId(e.target.value);
              }}
              label="Chọn Đơn Hàng Muốn Gộp"
              disabled={loading}
              onClick={(e) => {
                console.log("Select clicked", e);
                e.stopPropagation();
              }}
            >
              <MenuItem value="">Chọn đơn hàng</MenuItem>
              {availableOrders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  Đơn {order.id.slice(-6)} - Bàn {order.tables.map((t) => t.table_number).join(", ")} - {order.tables[0].area} -{" "}
                  {moment.utc(order.time).local().format("DD/MM/YY HH:mm")}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </MuiButton>
            <MuiButton
              variant="contained"
              color="primary"
              onClick={handleMergeOrder}
              disabled={loading}
            >
              Gộp Đơn
            </MuiButton>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export default MergeOrderModal;