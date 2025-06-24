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
import { useAppleStyles } from '../../../theme/theme-hooks';

const VoucherScreenView = ({
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const styles = useAppleStyles();
  console.log("Màu error.main:", styles);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: styles.spacing(3) }}>
        <Typography variant="h6" sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.heading }}>
          Quản lý Voucher
        </Typography>
        <Box sx={{ display: 'flex', gap: styles.spacing(2) }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
            sx={styles.button('outline')}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAdd}
            sx={styles.button('primary')}
          >
            Thêm voucher
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: styles.spacing(4) }}>
          <CircularProgress size={24} sx={{ color: styles.colors?.primary?.main || '#0071e3' }} />
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
        PaperProps={{ sx: styles.modal?.paper }}
      >
        <DialogTitle sx={{ ...styles.modal?.title, color: styles.colors?.error?.main || '#ff2d55' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2) }}>
            <AlertTriangle size={20} color={styles.colors?.error?.main || '#ff2d55'} />
            <Typography variant="subtitle1">Xác nhận xóa Voucher</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={styles.modal?.content}>
          <Typography variant="body1" sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.body1 }}>
            Bạn có chắc chắn muốn xóa voucher <strong>{voucherToDelete?.code}</strong> không?
          </Typography>
          <Typography variant="body2" sx={{ color: styles.colors?.error?.main || '#ff2d55', mt: 1, ...styles.components?.text?.body2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.modal?.actions}>
          <Button onClick={cancelDelete} variant="outlined" sx={styles.button('outline')}>
            Hủy
          </Button>
          <Button onClick={executeDelete} variant="contained" sx={{ ...styles.button('primary'), backgroundColor: styles.colors?.error?.main || '#ff2d55' }}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherScreenView;