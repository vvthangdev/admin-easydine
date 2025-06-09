'use client';

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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import viLocale from 'date-fns/locale/vi';
import { Ticket, Calendar, Percent, DollarSign, Users, UserPlus, Trash2 } from 'lucide-react';
import UserSelectModalView from './UserSelectModalView';
import VoucherFormModalViewModel from './VoucherFormModalViewModel';
import { theme } from '../../../styles'; // Chỉ import theme cho colors và spacing

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
    { id: 'name', label: 'Tên', width: '40%' },
    { id: 'username', label: 'Tên người dùng', width: '40%' },
    { id: 'action', label: 'Thao tác', width: '20%' },
  ];

  return (
    <>
      <Dialog
        open={visible}
        onClose={handleCancelWithConfirmation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Ticket size={20} color={theme.colors.primary.main} />
            <Typography variant="subtitle1">
              {editingVoucher ? 'Sửa Voucher' : 'Thêm Voucher'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Ticket size={20} color={theme.colors.primary.main} />
              <Typography variant="subtitle1">Thông tin Voucher</Typography>
            </Box>

            <TextField
              fullWidth
              label="Mã Voucher"
              name="code"
              value={form.code || ''}
              onChange={(e) => handleFieldChange('code', e.target.value)}
              required
              margin="dense"
              size="small"
              error={!!form.touched?.code}
              helperText={form.touched?.code || ''}
              InputProps={{
                startAdornment: (
                  <Ticket size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                ),
              }}
            />

            <TextField
              fullWidth
              label="Giảm giá"
              name="discount"
              type="number"
              value={form.discount || ''}
              onChange={(e) => handleFieldChange('discount', e.target.value)}
              required
              margin="dense"
              size="small"
              error={!!form.touched?.discount}
              helperText={form.touched?.discount || ''}
              InputProps={{
                startAdornment: (
                  <Percent size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                ),
              }}
            />

            <FormControl
              fullWidth
              margin="dense"
              size="small"
              required
              error={!!form.touched?.discountType}
            >
              <InputLabel>Loại giảm giá</InputLabel>
              <Select
                name="discountType"
                value={form.discountType || ''}
                onChange={(e) => handleFieldChange('discountType', e.target.value)}
                startAdornment={
                  <Percent size={16} color={theme.colors.primary.main} style={{ marginRight: 8, marginLeft: -4 }} />
                }
              >
                <MenuItem value="percentage">Phần trăm</MenuItem>
                <MenuItem value="fixed">Cố định</MenuItem>
              </Select>
              {!!form.touched?.discountType && (
                <FormHelperText>{form.touched?.discountType}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Đơn tối thiểu (VNĐ)"
              name="minOrderValue"
              type="number"
              value={form.minOrderValue || 0}
              onChange={(e) => handleFieldChange('minOrderValue', e.target.value)}
              margin="dense"
              size="small"
              error={!!form.touched?.minOrderValue}
              helperText={form.touched?.minOrderValue || ''}
              InputProps={{
                startAdornment: (
                  <DollarSign size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Calendar size={20} color={theme.colors.primary.main} />
              <Typography variant="subtitle1">Thời gian hiệu lực</Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DatePicker
                label="Ngày bắt đầu"
                value={form.startDate || null}
                onChange={(date) => handleFieldChange('startDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    size: 'small',
                    error: !!form.touched?.startDate,
                    helperText: form.touched?.startDate || '',
                    InputProps: {
                      startAdornment: (
                        <Calendar size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                      ),
                    },
                  },
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={form.endDate || null}
                onChange={(date) => handleFieldChange('endDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    size: 'small',
                    error: !!form.touched?.endDate,
                    helperText: form.touched?.endDate || '',
                    InputProps: {
                      startAdornment: (
                        <Calendar size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                      ),
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Users size={20} color={theme.colors.primary.main} />
              <Typography variant="subtitle1">Cài đặt sử dụng</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive || false}
                  onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                />
              }
              label="Kích hoạt"
              sx={{ mb: 2, '& .MuiTypography-root': { fontSize: '0.875rem' } }}
            />

            <TextField
              fullWidth
              label="Giới hạn sử dụng"
              name="usageLimit"
              type="number"
              value={form.usageLimit || ''}
              onChange={(e) => handleFieldChange('usageLimit', e.target.value)}
              margin="dense"
              size="small"
              error={!!form.touched?.usageLimit}
              helperText={form.touched?.usageLimit || 'Để trống nếu không giới hạn'}
              InputProps={{
                startAdornment: (
                  <Users size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
                ),
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
                InputProps={{
                  startAdornment: (
                    <Users size={16} color={theme.colors.neutral[400]} style={{ marginRight: 8 }} />
                  ),
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <UserPlus size={20} color={theme.colors.primary.main} />
                <Typography variant="subtitle1">Người dùng áp dụng</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<UserPlus size={16} />}
                onClick={() => setUserSelectModalOpen(true)}
                disabled={loading}
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ minHeight: 120 }}>
              <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    {userColumns.map((column) => (
                      <TableCell key={column.id} sx={{ width: column.width }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : selectedUsers.length > 0 ? (
                    selectedUsers
                      .map((userId) => {
                        const user = allUsers.find((u) => u._id === userId);
                        return user ? (
                          <TableRow key={userId}>
                            <TableCell
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {user.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: theme.colors.neutral[400],
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {user.username}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveUser(userId)}
                                  disabled={loading}
                                  color="error"
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
                      <TableCell colSpan={3} align="center">
                        {selectedUsers.length === 0
                          ? 'Voucher áp dụng cho tất cả người dùng'
                          : 'Không có người dùng được chọn'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {selectedUsers.length === 0
                ? 'Không chọn người dùng nào sẽ áp dụng voucher cho tất cả người dùng'
                : `Đã chọn ${selectedUsers.length} người dùng`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelWithConfirmation} disabled={loading} variant="outlined">
            Hủy
          </Button>
          <Button onClick={onOk} disabled={loading} variant="contained">
            {loading ? <CircularProgress size={20} /> : editingVoucher ? 'Cập nhật' : 'Thêm mới'}
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