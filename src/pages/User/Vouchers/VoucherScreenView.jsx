"use client";

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Plus, RefreshCw, AlertTriangle } from "lucide-react";
import VoucherFormModalView from "./VoucherFormModalView";
import VoucherTable from "./VoucherTable";
import VoucherScreenViewModel from "./VoucherScreenViewModel";
import {
  dialogStyles,
  buttonStyles,
  progressStyles,
  typography,
  colors,
  boxStyles,
  textStyles,
} from "../../../styles"; // Import styles từ index.js

const VoucherScreenView = ({ selectedUsers, setSelectedUsers, setSnackbar }) => {
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
      <Box sx={boxStyles.header}> {/* Sử dụng boxStyles.header */}
        <Typography variant="h6" sx={{ color: colors.neutral[800], ...typography.h6 }}>
          Quản lý Voucher
        </Typography>
        <Box sx={boxStyles.buttonGroup}> {/* Sử dụng boxStyles.buttonGroup */}
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
            sx={buttonStyles.outlinedPrimary} // Sử dụng buttonStyles.outlinedPrimary
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAdd}
            sx={buttonStyles.primary} // Sử dụng buttonStyles.primary
          >
            Thêm voucher
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={progressStyles.primary} /> {/* Sử dụng progressStyles.primary */}
        </Box>
      ) : (
        <VoucherTable vouchers={vouchers} loading={loading} onEdit={handleEdit} onDelete={confirmDelete} />
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
        PaperProps={{ sx: dialogStyles.paper }} // Sử dụng dialogStyles.paper
      >
        <DialogTitle sx={dialogStyles.titleError}> {/* Sử dụng dialogStyles.titleError */}
          <AlertTriangle size={20} color={colors.error.main} />
          Xác nhận xóa Voucher
        </DialogTitle>
        <DialogContent sx={dialogStyles.content}>
          <Typography variant="body1" sx={{ color: colors.neutral[800], ...typography.body1 }}>
            Bạn có chắc chắn muốn xóa voucher <strong>{voucherToDelete?.code}</strong> không?
          </Typography>
          <Typography variant="body2" sx={textStyles.error}> {/* Sử dụng textStyles.error */}
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={dialogStyles.actions}>
          <Button
            onClick={cancelDelete}
            sx={buttonStyles.outlined} // Sử dụng buttonStyles.outlined
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={executeDelete}
            sx={buttonStyles.danger} // Sử dụng buttonStyles.danger
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherScreenView;