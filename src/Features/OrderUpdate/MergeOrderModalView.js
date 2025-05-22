import React from "react";
import {
  Modal as MuiModal,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Box,
} from "@mui/material";
import moment from "moment";
import MergeOrderModalViewModel from "./MergeOrderModalViewModel";

const MergeOrderModalView = ({ visible, targetOrder, onCancel, onSuccess, zIndex }) => {
  const {
    sourceOrderId,
    availableOrders,
    loading,
    onSelectOrder,
    onMergeOrder,
  } = MergeOrderModalViewModel({ visible, targetOrder, onCancel, onSuccess });

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
                onSelectOrder(e.target.value);
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
              onClick={onMergeOrder}
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

export default MergeOrderModalView;