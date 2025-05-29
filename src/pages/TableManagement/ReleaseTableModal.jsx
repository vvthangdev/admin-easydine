import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ReleaseTableModal = ({ open, onClose, onConfirm, tableNumber }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
    >
      <DialogTitle>Xác nhận trả bàn</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Bạn có chắc muốn trả bàn số {tableNumber} không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
        >
          Trả bàn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReleaseTableModal;