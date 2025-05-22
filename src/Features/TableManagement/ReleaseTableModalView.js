import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import ReleaseTableModalViewModel from "./ReleaseTableModalViewModel";

const ReleaseTableModalView = ({ open, onClose, onConfirm, tableNumber }) => {
  const { handleClose, handleConfirm } = ReleaseTableModalViewModel({ onClose, onConfirm });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
        >
          Trả bàn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReleaseTableModalView;