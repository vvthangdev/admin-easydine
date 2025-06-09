'use client';

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import VoucherFormModalView from './VoucherFormModalView';
import VoucherTable from './VoucherTable';
import VoucherScreenViewModel from './VoucherScreenViewModel';
import { theme } from '../../../styles'; // Chỉ import theme cho colors

const VoucherScreenView = ({
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const {
    vouchers,
    isModalVisible,
    form,
    formTouched,
    editingVoucher,
    loading,
    allUsers,
    isDeleteDialogOpen,
    voucherToDelete,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalCancel,
    setForm,
    confirmDelete,
    executeDelete,
    cancelDelete,
  } = VoucherScreenViewModel({ selectedUsers, setSelectedUsers, setSnackbar });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Quản lý Voucher
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAdd}
          >
            Thêm voucher
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <VoucherTable
          vouchers={vouchers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      )}

      <VoucherFormModalView
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        form={{
          ...form,
          setFieldsValue: (values) => setForm({ ...form, ...values }),
          touched: formTouched,
        }}
        editingVoucher={editingVoucher}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        setSnackbar={setSnackbar}
        allUsers={allUsers}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={cancelDelete}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AlertTriangle size={20} color={theme.colors.error.main} />
            <Typography variant="subtitle1">Xác nhận xóa Voucher</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa voucher <strong>{voucherToDelete?.code}</strong> không?
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.error.main, mt: 1 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined">
            Hủy
          </Button>
          <Button onClick={executeDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherScreenView;