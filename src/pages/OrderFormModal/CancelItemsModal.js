import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { orderAPI } from "../../services/apis/Order";
import { toast } from "react-toastify";

const CancelItemsModal = ({ visible, onCancel, onSuccess, orderId, items, zIndex }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (itemId, size, value) => {
    const quantity = Math.max(0, Math.min(parseInt(value) || 0, getMaxQuantity(itemId, size)));
    setSelectedItems((prev) => {
      const existingItem = prev.find(
        (item) => item.item_id === itemId && item.size === (size || null)
      );
      if (existingItem) {
        if (quantity === 0) {
          return prev.filter(
            (item) => !(item.item_id === itemId && item.size === (size || null))
          );
        }
        return prev.map((item) =>
          item.item_id === itemId && item.size === (size || null)
            ? { ...item, quantity }
            : item
        );
      }
      return [
        ...prev,
        { item_id: itemId, quantity, size: size || null, cancel_reason: "User request" },
      ];
    });
  };

  const handleReasonChange = (itemId, size, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.item_id === itemId && item.size === (size || null)
          ? { ...item, cancel_reason: value || "User request" }
          : item
      )
    );
  };

  const getMaxQuantity = (itemId, size) => {
    const item = items.find((i) => i.id === itemId && i.size === (size || null));
    return item ? item.quantity : 0;
  };

  const handleConfirmCancel = async () => {
    if (!selectedItems.length || selectedItems.every((item) => item.quantity === 0)) {
      toast.error("Vui lòng chọn ít nhất một món để hủy");
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.cancelItems({
        order_id: orderId,
        items: selectedItems,
      });
      onSuccess(response.remainingItems);
    } catch (error) {
      console.error("Error canceling items:", error);
      toast.error("Lỗi khi hủy món ăn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onClose={onCancel}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex }}
    >
      <Box
        sx={{
          width: { xs: "90vw", md: "600px" },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hủy Món Ăn
        </Typography>
        <TableContainer sx={{ maxHeight: 300, overflowY: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Tên món</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Kích thước</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số lượng hủy</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Lý do hủy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items && items.length > 0 ? (
                items.map((item) => (
                  <TableRow
                    key={`${item.id}-${item.size || "default"}`}
                    sx={{ "&:hover": { bgcolor: "grey.100" } }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.size || "Mặc định"}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={
                          selectedItems.find(
                            (i) => i.item_id === item.id && i.size === (item.size || null)
                          )?.quantity || 0
                        }
                        onChange={(e) => handleQuantityChange(item.id, item.size, e.target.value)}
                        inputProps={{ min: 0, max: item.quantity }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        / {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel>Lý do</InputLabel>
                        <Select
                          value={
                            selectedItems.find(
                              (i) => i.item_id === item.id && i.size === (item.size || null)
                            )?.cancel_reason || "User request"
                          }
                          onChange={(e) =>
                            handleReasonChange(item.id, item.size, e.target.value)
                          }
                        >
                          <MenuItem value="User request">Yêu cầu người dùng</MenuItem>
                          <MenuItem value="Changed mind">Thay đổi ý định</MenuItem>
                          <MenuItem value="Out of stock">Hết hàng</MenuItem>
                          <MenuItem value="Other">Khác</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Chưa có món ăn nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
            disabled={loading}
            sx={{ minWidth: 80 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmCancel}
            disabled={loading || !selectedItems.length}
            sx={{ minWidth: 80 }}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CancelItemsModal;