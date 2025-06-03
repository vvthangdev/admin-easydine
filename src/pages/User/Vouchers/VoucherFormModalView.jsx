"use client";

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
  Typography,
  IconButton,
  Tooltip,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import viLocale from "date-fns/locale/vi";
import { Ticket, Calendar, Percent, DollarSign, Users, UserPlus, Trash2 } from "lucide-react";
import UserSelectModalView from "./UserSelectModalView";
import VoucherFormModalViewModel from "./VoucherFormModalViewModel";
import {
  dialogStyles,
  buttonStyles,
  tableStyles,
  inputStyles,
  switchStyles,
  progressStyles,
  typography,
  colors,
} from "../../../styles"; // Import styles từ index.js

const VoucherFormModalView = ({
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
  const {
    userSelectModalOpen,
    setUserSelectModalOpen,
    handleFieldChange,
    handleRemoveUser,
    handleConfirmUserSelection,
    loading,
    handleCancelWithConfirmation,
  } = VoucherFormModalViewModel({
    form,
    editingVoucher,
    selectedUsers,
    setSelectedUsers,
    setSnackbar,
    onCancel,
  });

  const userColumns = [
    { id: "name", label: "Tên", width: "40%" },
    { id: "username", label: "Tên người dùng", width: "40%" },
    { id: "action", label: "Thao tác", width: "20%" },
  ];

  return (
    <>
      <Dialog
        open={visible}
        onClose={handleCancelWithConfirmation}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: dialogStyles.paper }} // Sử dụng dialogStyles.paper
      >
        <DialogTitle sx={dialogStyles.title}>
          <Ticket size={20} color={colors.primary.main} />
          {editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        </DialogTitle>
        <DialogContent sx={dialogStyles.content}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Ticket size={20} color={colors.primary.main} />
              <Typography variant="subtitle1" sx={{ color: colors.neutral[800], ...typography.subtitle1 }}>
                Thông tin Voucher
              </Typography>
            </Box>

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
              sx={inputStyles.textField} // Sử dụng inputStyles.textField
              InputProps={{
                startAdornment: <Ticket size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
              }}
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
              sx={inputStyles.textField} // Sử dụng inputStyles.textField
              InputProps={{
                startAdornment: <Percent size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
              }}
            />

            <FormControl
              fullWidth
              margin="dense"
              size="small"
              required
              error={!!form.touched?.discountType}
              sx={inputStyles.select} // Sử dụng inputStyles.select
            >
              <InputLabel>Loại giảm giá</InputLabel>
              <Select
                name="discountType"
                value={form.discountType || ""}
                onChange={(e) => handleFieldChange("discountType", e.target.value)}
                startAdornment={
                  <Percent size={16} color={colors.primary.main} style={{ marginRight: 8, marginLeft: -4 }} />
                }
              >
                <MenuItem value="percentage">Phần trăm</MenuItem>
                <MenuItem value="fixed">Cố định</MenuItem>
              </Select>
              {!!form.touched?.discountType && <FormHelperText>{form.touched?.discountType}</FormHelperText>}
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
              sx={inputStyles.textField} // Sử dụng inputStyles.textField
              InputProps={{
                startAdornment: <DollarSign size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Calendar size={20} color={colors.primary.main} />
              <Typography variant="subtitle1" sx={{ color: colors.neutral[800], ...typography.subtitle1 }}>
                Thời gian hiệu lực
              </Typography>
            </Box>

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
                    sx: inputStyles.datePicker, // Sử dụng inputStyles.datePicker
                    InputProps: {
                      startAdornment: <Calendar size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
                    },
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
                    sx: inputStyles.datePicker, // Sử dụng inputStyles.datePicker
                    InputProps: {
                      startAdornment: <Calendar size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Users size={20} color={colors.primary.main} />
              <Typography variant="subtitle1" sx={{ color: colors.neutral[800], ...typography.subtitle1 }}>
                Cài đặt sử dụng
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive || false}
                  onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                  sx={switchStyles.default} // Sử dụng switchStyles.default
                />
              }
              label="Kích hoạt"
              sx={{ mb: 2, "& .MuiTypography-root": { fontSize: "0.875rem" } }}
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
              sx={inputStyles.textField} // Sử dụng inputStyles.textField
              InputProps={{
                startAdornment: <Users size={16} color={colors.primary.main} style={{ marginRight: 8 }} />,
              }}
            />

            {editingVoucher && (
              <TextField
                fullWidth
                label="Số lượt sử dụng"
                name="usedCount"
                type="number"
                value={form.usedCount || 0}
                disabled
                margin="dense"
                size="small"
                sx={inputStyles.disabled} // Sử dụng inputStyles.disabled
                InputProps={{
                  startAdornment: <Users size={16} color={colors.neutral[400]} style={{ marginRight: 8 }} />,
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <UserPlus size={20} color={colors.primary.main} />
                <Typography variant="subtitle1" sx={{ color: colors.neutral[800], ...typography.subtitle1 }}>
                  Người dùng áp dụng
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<UserPlus size={16} />}
                onClick={() => setUserSelectModalOpen(true)}
                disabled={loading}
                sx={buttonStyles.outlinedPrimary} // Sử dụng buttonStyles.outlinedPrimary
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ ...tableStyles.container, minHeight: 120 }} // Sử dụng tableStyles.container, thêm minHeight
            >
              <Table stickyHeader sx={{ tableLayout: "fixed" }}>
                <TableHead sx={tableStyles.head}> {/* Sử dụng tableStyles.head */}
                  <TableRow>
                    {userColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          ...tableStyles.cell, // Sử dụng tableStyles.cell
                          width: column.width,
                          fontWeight: 600, // Giữ fontWeight cho header
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress size={24} sx={progressStyles.primary} /> {/* Sử dụng progressStyles.primary */}
                      </TableCell>
                    </TableRow>
                  ) : selectedUsers.length > 0 ? (
                    selectedUsers
                      .map((userId) => {
                        const user = allUsers.find((u) => u._id === userId);
                        return user ? (
                          <TableRow
                            key={userId}
                            sx={tableStyles.row} // Sử dụng tableStyles.row
                          >
                            <TableCell
                              sx={{
                                ...tableStyles.cell, // Sử dụng tableStyles.cell
                                fontWeight: 500, // Giữ fontWeight
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {user.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...tableStyles.cell, // Sử dụng tableStyles.cell
                                color: colors.neutral[400], // Giữ màu username
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {user.username}
                            </TableCell>
                            <TableCell sx={tableStyles.cell}>
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveUser(userId)}
                                  disabled={loading}
                                  sx={buttonStyles.dangerIconButton} // Sử dụng buttonStyles.dangerIconButton
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ) : null;
                      })
                      .filter(Boolean)
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={tableStyles.empty} // Sử dụng tableStyles.empty
                      >
                        {selectedUsers.length === 0
                          ? "Voucher áp dụng cho tất cả người dùng"
                          : "Không có người dùng được chọn"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="caption"
              sx={{ color: colors.neutral[400], mt: 1, display: "block", ...typography.caption }}
            >
              {selectedUsers.length === 0
                ? "Không chọn người dùng nào sẽ áp dụng voucher cho tất cả người dùng"
                : `Đã chọn ${selectedUsers.length} người dùng`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={dialogStyles.actions}>
          <Button
            onClick={handleCancelWithConfirmation}
            disabled={loading}
            sx={buttonStyles.outlined} // Sử dụng buttonStyles.outlined
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={onOk}
            disabled={loading}
            sx={buttonStyles.primary} // Sử dụng buttonStyles.primary
            variant="contained"
          >
            {loading ? <CircularProgress size={20} sx={progressStyles.white} /> : editingVoucher ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      <UserSelectModalView
        visible={userSelectModalOpen}
        onOk={() => handleConfirmUserSelection()}
        onCancel={() => setUserSelectModalOpen(false)}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        setSnackbar={setSnackbar}
      />
    </>
  );
};

export default VoucherFormModalView;