import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import SelectedItemsViewModel from "./SelectedItemsViewModel";

const SelectedItemsView = ({ selectedItems, setSelectedItems, menuItems }) => {
  const {
    handleQuantityChange,
    handleSizeChange,
    handleNoteChange,
    handleRemove,
    subtotal,
    vat,
    total,
  } = SelectedItemsViewModel({ selectedItems, setSelectedItems, menuItems });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 2, flexShrink: 0 }}>
        Món đã chọn
      </Typography>
      <TableContainer
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100% - 180px)",
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
                sx={{ "&:hover": { bgcolor: "grey.100" } }}
              >
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  {menuItems.find((m) => m._id === record.id)?.sizes?.length > 0 ? (
                    <FormControl fullWidth>
                      <InputLabel>Chọn kích thước</InputLabel>
                      <Select
                        value={record.size || ""}
                        label="Chọn kích thước"
                        onChange={(e) => handleSizeChange(record.id, record.size, e.target.value)}
                      >
                        <MenuItem value="">Không chọn</MenuItem>
                        {menuItems
                          .find((m) => m._id === record.id)
                          ?.sizes.map((s) => (
                            <MenuItem key={s._id} value={s.name}>
                              {`${s.name} - ${s.price.toLocaleString()}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : (
                    record.price.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={record.quantity}
                    onChange={(e) => handleQuantityChange(record.id, record.size, e.target.value)}
                    inputProps={{ min: 1 }}
                    sx={{ width: 60 }}
                  />
                </TableCell>
                <TableCell>{(record.price * record.quantity).toLocaleString()}</TableCell>
                <TableCell>
                  <TextField
                    multiline
                    rows={3}
                    value={record.note}
                    onChange={(e) => handleNoteChange(record.id, record.size, e.target.value)}
                    placeholder="Nhập ghi chú (ví dụ: Ít đá)"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleRemove(record.id, record.size)}
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
          mt: 2,
          p: 2,
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
    </Box>
  );
};

export default SelectedItemsView;