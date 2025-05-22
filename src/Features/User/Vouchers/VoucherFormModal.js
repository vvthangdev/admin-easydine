import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import viLocale from "date-fns/locale/vi";
import UserSelectModal from "./UserSelectModal";
import { voucherAPI } from "../../../services/apis/Voucher";

const VoucherFormModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingVoucher,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
  allUsers,
}) => {
  const [userSelectModalOpen, setUserSelectModalOpen] = useState(false);

  const handleFieldChange = (field, value) => {
    form.setFieldsValue({ [field]: value });
  };

  const handleRemoveUser = async (userId) => {
    if (editingVoucher) {
      try {
        await voucherAPI.removeUsersFromVoucher(editingVoucher._id, [userId]);
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        setSnackbar({
          open: true,
          message: "Xóa người dùng khỏi voucher thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Xóa người dùng thất bại: ${error.message}`,
          severity: "error",
        });
      }
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleAddUsers = async (userIds) => {
    if (editingVoucher) {
      try {
        await voucherAPI.addUsersToVoucher(editingVoucher._id, userIds);
        setSelectedUsers([...new Set([...selectedUsers, ...userIds])]);
        setSnackbar({
          open: true,
          message: "Thêm người dùng vào voucher thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Thêm người dùng thất bại: ${error.message}`,
          severity: "error",
        });
      }
    } else {
      setSelectedUsers([...new Set([...selectedUsers, ...userIds])]);
    }
  };

  const userColumns = [
    { id: "name", label: "Tên", width: "40%" },
    { id: "username", label: "Tên người dùng", width: "40%" },
    { id: "action", label: "Thao tác", width: "20%" },
  ];

  return (
    <>
      <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: "1rem" }}>
          {editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <TextField
            fullWidth
            label="Mã Voucher"
            name="code"
            value={form.code || ""}
            onChange={(e) => handleFieldChange("code", e.target.value)}
            required
            margin="dense"
            size="small"
            error={!!form.touched?.code}
            helperText={form.touched?.code || ""}
            sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          <TextField
            fullWidth
            label="Giảm giá"
            name="discount"
            type="number"
            value={form.discount || ""}
            onChange={(e) => handleFieldChange("discount", e.target.value)}
            required
            margin="dense"
            size="small"
            error={!!form.touched?.discount}
            helperText={form.touched?.discount || ""}
            sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          <FormControl fullWidth margin="dense" size="small" required>
            <InputLabel sx={{ fontSize: "0.85rem" }}>Loại giảm giá</InputLabel>
            <Select
              name="discountType"
              value={form.discountType || ""}
              onChange={(e) => handleFieldChange("discountType", e.target.value)}
              error={!!form.touched?.discountType}
              sx={{ "& .MuiSelect-select": { fontSize: "0.85rem" } }}
            >
              <MenuItem value="percentage">Phần trăm</MenuItem>
              <MenuItem value="fixed">Cố định</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Đơn tối thiểu (VNĐ)"
            name="minOrderValue"
            type="number"
            value={form.minOrderValue || 0}
            onChange={(e) => handleFieldChange("minOrderValue", e.target.value)}
            margin="dense"
            size="small"
            error={!!form.touched?.minOrderValue}
            helperText={form.touched?.minOrderValue || ""}
            sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
            <DatePicker
              label="Ngày bắt đầu"
              value={form.startDate || null}
              onChange={(date) => handleFieldChange("startDate", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  size: "small",
                  error: !!form.touched?.startDate,
                  helperText: form.touched?.startDate || "",
                  sx: { "& .MuiInputBase-input": { fontSize: "0.85rem" } },
                },
              }}
            />
            <DatePicker
              label="Ngày kết thúc"
              value={form.endDate || null}
              onChange={(date) => handleFieldChange("endDate", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  size: "small",
                  error: !!form.touched?.endDate,
                  helperText: form.touched?.endDate || "",
                  sx: { "& .MuiInputBase-input": { fontSize: "0.85rem" } },
                },
              }}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive || false}
                onChange={(e) => handleFieldChange("isActive", e.target.checked)}
              />
            }
            label="Kích hoạt"
            sx={{ my: 1, "& .MuiTypography-root": { fontSize: "0.85rem" } }}
          />
          <TextField
            fullWidth
            label="Giới hạn sử dụng"
            name="usageLimit"
            type="number"
            value={form.usageLimit || ""}
            onChange={(e) => handleFieldChange("usageLimit", e.target.value)}
            margin="dense"
            size="small"
            error={!!form.touched?.usageLimit}
            helperText={form.touched?.usageLimit || "Để trống nếu không giới hạn"}
            sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          {editingVoucher && (
            <TextField
              fullWidth
              label="Số lượt sử dụng"
              name="usedCount"
              type="number"
              value={form.usedCount || 0}
              disabled // Chỉ đọc
              margin="dense"
              size="small"
              sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
            />
          )}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setUserSelectModalOpen(true)}
              sx={{ fontSize: "0.85rem" }}
            >
              Thêm người dùng
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
            <Table stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  {userColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{ width: column.width, fontSize: "0.75rem", p: 1 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((userId) => {
                    const user = allUsers.find((u) => u._id === userId);
                    return user ? (
                      <TableRow key={userId}>
                        <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                          {user.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                          {user.username}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveUser(userId)}
                            sx={{ fontSize: "0.75rem", p: 0 }}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  }).filter(Boolean)
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center", fontSize: "0.75rem", p: 1 }}>
                      Không có người dùng được chọn
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} sx={{ fontSize: "0.85rem" }}>Hủy</Button>
          <Button onClick={onOk} variant="contained" sx={{ fontSize: "0.85rem" }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <UserSelectModal
        visible={userSelectModalOpen}
        onOk={() => setUserSelectModalOpen(false)}
        onCancel={() => setUserSelectModalOpen(false)}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleAddUsers}
        setSnackbar={setSnackbar}
      />
    </>
  );
};

export default VoucherFormModal;