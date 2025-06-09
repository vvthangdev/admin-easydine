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
import { useAppleStyles } from '../../../theme/theme-hooks';

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
  const styles = useAppleStyles();
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
        PaperProps={{ sx: styles.modal?.paper }}
      >
        <DialogTitle sx={styles.modal?.title}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2) }}>
            <Ticket size={20} color={styles.colors?.primary?.main || '#0071e3'} />
            <Typography variant="subtitle1">
              {editingVoucher ? 'Sửa Voucher' : 'Thêm Voucher'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={styles.modal?.content}>
          <Box sx={{ mb: styles.spacing(3) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2), mb: styles.spacing(2) }}>
              <Ticket size={20} color={styles.colors?.primary?.main || '#0071e3'} />
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
              sx={styles.input('default')}
              InputProps={{
                startAdornment: (
                  <Ticket size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
              sx={styles.input('default')}
              InputProps={{
                startAdornment: (
                  <Percent size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
                ),
              }}
            />

            <FormControl
              fullWidth
              margin="dense"
              size="small"
              required
              error={!!form.touched?.discountType}
              sx={styles.input('default')}
            >
              <InputLabel>Loại giảm giá</InputLabel>
              <Select
                name="discountType"
                value={form.discountType || ''}
                onChange={(e) => handleFieldChange('discountType', e.target.value)}
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
              sx={styles.input('default')}
              InputProps={{
                startAdornment: (
                  <DollarSign size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: styles.spacing(3) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2), mb: styles.spacing(2) }}>
              <Calendar size={20} color={styles.colors?.primary?.main || '#0071e3'} />
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
                    sx: styles.input('default'),
                    InputProps: {
                      startAdornment: (
                        <Calendar size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
                    sx: styles.input('default'),
                    InputProps: {
                      startAdornment: (
                        <Calendar size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
                      ),
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: styles.spacing(3) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2), mb: styles.spacing(2) }}>
              <Users size={20} color={styles.colors?.primary?.main || '#0071e3'} />
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
              sx={{ mb: styles.spacing(2), '& .MuiTypography-root': { fontSize: '0.875rem' } }}
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
              sx={styles.input('default')}
              InputProps={{
                startAdornment: (
                  <Users size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
                sx={styles.input('default')}
                InputProps={{
                  startAdornment: (
                    <Users size={16} color={styles.colors?.neutral?.[400] || '#9e9e9e'} style={{ marginRight: 8 }} />
                  ),
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: styles.spacing(3) }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: styles.spacing(2) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2) }}>
                <UserPlus size={20} color={styles.colors?.primary?.main || '#0071e3'} />
                <Typography variant="subtitle1">Người dùng áp dụng</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<UserPlus size={16} />}
                onClick={() => setUserSelectModalOpen(true)}
                disabled={loading}
                sx={styles.button('outline')}
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ ...styles.components?.table?.container, minHeight: 120 }}>
              <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
                <TableHead sx={styles.components?.table?.head}>
                  <TableRow>
                    {userColumns.map((column) => (
                      <TableCell key={column.id} sx={{ ...styles.components?.table?.cell, width: column.width }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: styles.spacing(4) }}>
                        <CircularProgress size={24} sx={{ color: styles.colors?.primary?.main || '#0071e3' }} />
                      </TableCell>
                    </TableRow>
                  ) : selectedUsers.length > 0 ? (
                    selectedUsers
                      .map((userId) => {
                        const user = allUsers.find((u) => u._id === userId);
                        return user ? (
                          <TableRow key={userId} sx={styles.components?.table?.row}>
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
                                color: styles.colors?.neutral?.[400] || '#9e9e9e',
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
                                  sx={{ color: styles.colors?.error?.main || '#ff2d55' }}
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
            <Typography variant="caption" sx={{ mt: styles.spacing(1), display: 'block' }}>
              {selectedUsers.length === 0
                ? 'Không chọn người dùng nào sẽ áp dụng voucher cho tất cả người dùng'
                : `Đã chọn ${selectedUsers.length} người dùng`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={styles.modal?.actions}>
          <Button onClick={handleCancelWithConfirmation} disabled={loading} variant="outlined" sx={styles.button('outline')}>
            Hủy
          </Button>
          <Button onClick={onOk} disabled={loading} variant="contained" sx={styles.button('primary')}>
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