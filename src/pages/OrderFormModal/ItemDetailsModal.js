import React, { useState, useEffect } from "react";
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
  sizes = [],
  isEditing = false,
}) => {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    console.log("ItemDetailsModal opened. Item:", item, "Sizes:", sizes);
    if (open) {
      if (isEditing && item) {
        setSize(item.size || "");
        setQuantity(item.quantity || 1);
        setNote(item.note || "");
      } else {
        setSize("");
        setQuantity(1);
        setNote("");
      }
    }
  }, [open, isEditing, item]);

  const handleConfirm = () => {
    const validQuantity = parseInt(quantity) || 1;
    if (validQuantity < 1) {
      return;
    }

    let finalPrice = item?.price || 0;
    if (size && sizes.length > 0) {
      const selectedSizeInfo = sizes.find((s) => s.name === size);
      if (selectedSizeInfo) {
        finalPrice = selectedSizeInfo.price;
      }
    }

    const itemData = {
      id: item.id,
      name: item.name,
      itemName: item.itemName || item.name,
      itemImage: item.itemImage || item.image || "https://via.placeholder.com/80",
      price: finalPrice,
      size: size || null,
      quantity: validQuantity,
      note: note.trim(),
    };

    onConfirm(itemData);
    onClose();
  };

  const handleClose = () => {
    setSize("");
    setQuantity(1);
    setNote("");
    onClose();
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 999)) {
      setQuantity(value);
    }
  };

  const displayPrice = () => {
    if (size && sizes.length > 0) {
      const selectedSizeInfo = sizes.find((s) => s.name === size);
      if (selectedSizeInfo) {
        return selectedSizeInfo.price.toLocaleString();
      }
    }
    return item?.price ? item.price.toLocaleString() : "0";
  };

  if (!item) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          width: 400,
          maxWidth: "90%",
        }}
      >
        <Typography variant="h6">{isEditing ? "Chỉnh sửa món" : "Thêm món"}</Typography>
        <Typography variant="subtitle1">{item.name}</Typography>
        <Typography>Giá: {displayPrice()} VND</Typography>

        {sizes && sizes.length > 0 ? (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Kích thước</InputLabel>
            <Select
              value={size}
              label="Kích thước"
              onChange={(e) => setSize(e.target.value)}
            >
              <MenuItem value="">
                <em>Chọn kích thước</em>
              </MenuItem>
              {sizes.map((s) => (
                <MenuItem key={s._id || s.name} value={s.name}>
                  {s.name} - {s.price.toLocaleString()} VND
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography sx={{ mt: 2 }}>Không có kích thước bổ sung</Typography>
        )}

        <TextField
          label="Số lượng"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1, max: 999 }}
          fullWidth
          sx={{ mt: 2 }}
        />

        <TextField
          label="Ghi chú"
          multiline
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!quantity || parseInt(quantity) < 1}
          >
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ItemDetailsModal;