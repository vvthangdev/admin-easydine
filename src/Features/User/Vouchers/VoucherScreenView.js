"use client"

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react'
import VoucherFormModalView from "./VoucherFormModalView"
import VoucherTable from "./VoucherTable"
import VoucherScreenViewModel from "./VoucherScreenViewModel"
import { useState } from "react"

const VoucherScreenView = ({ selectedUsers, setSelectedUsers, setSnackbar }) => {
  const {
    vouchers,
    isModalVisible,
    form,
    formTouched,
    editingVoucher,
    loading,
    allUsers,
    handleAdd,
    handleEdit,
    handleDelete,
    handleModalOk,
    handleModalCancel,
    setForm,
  } = VoucherScreenViewModel({ selectedUsers, setSelectedUsers, setSnackbar })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [voucherToDelete, setVoucherToDelete] = useState(null)

  const confirmDelete = (voucher) => {
    setVoucherToDelete(voucher)
    setIsDeleteDialogOpen(true)
  }

  const executeDelete = () => {
    handleDelete(voucherToDelete)
    setIsDeleteDialogOpen(false)
    setVoucherToDelete(null)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
          }}
        >
          Quản lý Voucher
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
            sx={{
              borderColor: "#0071e3",
              color: "#0071e3",
              borderRadius: 28,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#0071e3",
                background: "rgba(0, 113, 227, 0.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAdd}
            sx={{
              background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
              color: "#ffffff",
              borderRadius: 28,
              px: 3,
              boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Thêm voucher
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#0071e3" }} />
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
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            overflow: "hidden",
            maxWidth: 400,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background: "linear-gradient(145deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 59, 48, 0.1) 100%)",
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <AlertTriangle size={20} color="#ff3b30" />
          Xác nhận xóa Voucher
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" sx={{ color: "#1d1d1f" }}>
            Bạn có chắc chắn muốn xóa voucher <strong>{voucherToDelete?.code}</strong> không?
          </Typography>
          <Typography variant="body2" sx={{ color: "#ff3b30", mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{
              borderColor: "#86868b",
              color: "#86868b",
              borderRadius: 28,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#1d1d1f",
                color: "#1d1d1f",
                background: "rgba(0, 0, 0, 0.05)",
              },
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={executeDelete}
            sx={{
              background: "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)",
              color: "#ffffff",
              borderRadius: 28,
              px: 3,
              boxShadow: "0 4px 12px rgba(255, 59, 48, 0.2)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)",
                boxShadow: "0 6px 16px rgba(255, 59, 48, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default VoucherScreenView
