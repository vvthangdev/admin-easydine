import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Box,
} from "@mui/material";
import SelectedItemsViewModel from "./SelectedItemsViewModel";
import ItemDetailsModal from "./ItemDetailsModal";

const SelectedItemsView = ({ selectedItems, setSelectedItems, menuItems, readOnly = false }) => {
  const {
    handleRemove,
    handleEditItem,
    subtotal,
    vat,
    total,
  } = SelectedItemsViewModel({ selectedItems, setSelectedItems, menuItems });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenItemModal = (record) => {
    if (!readOnly) {
      setSelectedItem(record);
      setModalOpen(true);
    }
  };

  const handleConfirmEdit = (itemData) => {
    handleEditItem(itemData);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
      <Typography variant="h6" sx={{ mb: 1, flexShrink: 0 }}>
        Món đã chọn
      </Typography>
      <TableContainer
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100% - 140px)",
          maxWidth: "100%",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tên món</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Kích thước - Giá</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tổng</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((record) => (
              <TableRow
                key={`${record.id}-${record.size || "default"}`}
                sx={{
                  "&:hover": { bgcolor: readOnly ? "inherit" : "grey.100", cursor: readOnly ? "default" : "pointer" },
                }}
                onClick={() => handleOpenItemModal(record)}
              >
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  {record.size
                    ? `${record.size} - ${record.price.toLocaleString()} VND`
                    : `${record.price.toLocaleString()} VND`}
                </TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>{(record.price * record.quantity).toLocaleString()} VND</TableCell>
                <TableCell>{record.note || "Không có ghi chú"}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(record.id, record.size);
                    }}
                    disabled={readOnly}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          mt: 1,
          p: 1,
          bgcolor: "grey.50",
          borderRadius: 1,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1">Hóa đơn tạm tính</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>Tổng tiền món:</Typography>
          <Typography fontWeight="bold">{subtotal.toLocaleString()} VND</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>VAT (10%):</Typography>
          <Typography fontWeight="bold">{vat.toLocaleString()} VND</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography fontWeight="bold">Tổng cộng:</Typography>
          <Typography fontWeight="bold" color="primary">
            {total.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>
      <ItemDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEdit}
        item={selectedItem}
        sizes={menuItems.find((m) => m._id === selectedItem?.id)?.sizes || []}
        isEditing={true}
      />
    </Box>
  );
};

export default SelectedItemsView;