import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const ItemDetailsModal = ({
  open,
  onClose,
  onConfirm,
  item,
  sizes = [], // Danh sách kích thước từ menuItem.sizes
  isEditing = false, // Xác định đang thêm mới hay sửa
}) => {
  const [size, setSize] = useState(item?.size || "");
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [note, setNote] = useState(item?.note || "");

  const handleConfirm = () => {
    const selectedSizeInfo = sizes.find((s) => s.name === size);
    const price = selectedSizeInfo ? selectedSizeInfo.price : item?.price || 0;
    onConfirm({
      id: item.id,
      name: item.name,
      price,
      size: size || null,
      quantity: parseInt(quantity) || 1,
      note,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          borderRadius: 2,
          maxWidth: 400,
          width: "90%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          {isEditing ? "Sửa món ăn" : "Thêm món ăn"}
        </Typography>
        <Typography variant="subtitle1">{item?.name}</Typography>

        {sizes.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Chọn kích thước</InputLabel>
            <Select
              value={size}
              label="Chọn kích thước"
              onChange={(e) => setSize(e.target.value)}
            >
              <MenuItem value="">Không chọn</MenuItem>
              {sizes.map((s) => (
                <MenuItem key={s._id} value={s.name}>
                  {`${s.name} - ${s.price.toLocaleString()} VND`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Số lượng"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          inputProps={{ min: 1 }}
          fullWidth
        />

        <TextField
          label="Ghi chú"
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú (ví dụ: Ít đá)"
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            sx={{ fontSize: "0.875rem" }}
          >
            Xác nhận
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ fontSize: "0.875rem" }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ItemDetailsModal;