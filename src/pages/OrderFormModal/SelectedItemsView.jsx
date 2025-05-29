import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import SelectedItemsViewModel from "./SelectedItemsViewModel";
import ItemDetailsModal from "./ItemDetailsModal";

const SelectedItemsView = ({ 
  selectedItems, 
  setSelectedItems, 
  menuItems, 
  readOnly = false 
}) => {
  const {
    handleRemove,
    handleEditItem,
    subtotal,
    vat,
    total,
  } = SelectedItemsViewModel({ selectedItems, setSelectedItems, menuItems });

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  const handleOpenEditModal = (record, e) => {
    if (readOnly) return;
    
    if (e) {
      e.stopPropagation();
    }
    
    // Tìm menu item gốc để lấy sizes
    const originalMenuItem = menuItems.find((m) => m._id === record.id);
    
    const itemData = {
      ...record,
      sizes: originalMenuItem?.sizes || [],
    };
    
    setSelectedItemForEdit(itemData);
    setItemModalOpen(true);
  };

  const handleConfirmEdit = (itemData) => {
    handleEditItem(itemData);
    setItemModalOpen(false);
    setSelectedItemForEdit(null);
  };

  const handleCloseEditModal = () => {
    setItemModalOpen(false);
    setSelectedItemForEdit(null);
  };

  const handleRemoveItem = (record, e) => {
    if (e) {
      e.stopPropagation();
    }
    handleRemove(record.id, record.size);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
      <Typography variant="h6" sx={{ mb: 1, flexShrink: 0 }}>
        Món đã chọn ({selectedItems.length})
      </Typography>
      
      <TableContainer
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100% - 140px)",
          maxWidth: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Tên món</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Kích thước & Giá</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50", textAlign: "center" }}>SL</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50", textAlign: "right" }}>Tổng</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Ghi chú</TableCell>
              {!readOnly && (
                <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50", textAlign: "center" }}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={readOnly ? 5 : 6} 
                  sx={{ textAlign: "center", py: 4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Chưa có món nào được chọn
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              selectedItems.map((record, index) => (
                <TableRow
                  key={`${record.id}-${record.size || "default"}-${index}`}
                  sx={{
                    "&:hover": { 
                      bgcolor: readOnly ? "inherit" : "grey.100", 
                      cursor: readOnly ? "default" : "pointer" 
                    },
                    transition: "background-color 0.2s",
                  }}
                  onClick={(e) => handleOpenEditModal(record, e)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record.name || record.itemName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {record.size && (
                        <Chip 
                          label={record.size} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 0.5, mr: 1 }}
                        />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ color: "success.main", fontWeight: 500 }}
                      >
                        {record.price.toLocaleString()} VND
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Typography 
                      variant="body2" 
                      sx={{ color: "primary.main", fontWeight: 600 }}
                    >
                      {(record.price * record.quantity).toLocaleString()} VND
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={record.note ? "text.primary" : "text.secondary"}
                      sx={{ 
                        fontStyle: record.note ? "normal" : "italic",
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={record.note || "Không có ghi chú"}
                    >
                      {record.note || "Không có ghi chú"}
                    </Typography>
                  </TableCell>
                  {!readOnly && (
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleOpenEditModal(record, e)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleRemoveItem(record, e)}
                          title="Xóa"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Tổng tiền */}
      <Box
        sx={{
          mt: 1,
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
          flexShrink: 0,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Hóa đơn tạm tính
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2">Tổng tiền món:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {subtotal.toLocaleString()} VND
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2">VAT (10%):</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {vat.toLocaleString()} VND
          </Typography>
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
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Tổng cộng:
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {total.toLocaleString()} VND
          </Typography>
        </Box>
      </Box>

      {/* Modal chỉnh sửa món ăn */}
      <ItemDetailsModal
        open={itemModalOpen}
        onClose={handleCloseEditModal}
        onConfirm={handleConfirmEdit}
        item={selectedItemForEdit}
        sizes={selectedItemForEdit?.sizes || []}
        isEditing={true}
      />
    </Box>
  );
};

export default SelectedItemsView;