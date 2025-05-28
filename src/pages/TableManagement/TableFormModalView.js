import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import TableFormModalViewModel from "./TableFormModalViewModel";

const TableFormModalView = ({ open, onClose, onSubmitSuccess, editingTable }) => {
  const {
    control,
    handleSubmit,
    handleFormSubmit,
    handleClose,
    areas,
    loading,
    errors,
  } = TableFormModalViewModel({
    onClose,
    onSubmitSuccess,
    editingTable,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingTable ? "Sửa thông tin bàn" : "Thêm bàn mới"}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
              name="table_number"
              control={control}
              rules={{
                required: "Vui lòng nhập số bàn!",
                min: { value: 1, message: "Số bàn phải lớn hơn 0" },
                validate: (value) =>
                  Number.isInteger(Number(value)) || "Số bàn phải là số nguyên",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số bàn"
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                  error={!!errors.table_number}
                  helperText={errors.table_number?.message}
                />
              )}
            />
            <Controller
              name="capacity"
              control={control}
              rules={{
                required: "Vui lòng nhập sức chứa!",
                min: { value: 1, message: "Sức chứa phải lớn hơn 0" },
                validate: (value) =>
                  Number.isInteger(Number(value)) || "Sức chứa phải là số nguyên",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sức chứa"
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message}
                />
              )}
            />
            <Controller
              name="area"
              control={control}
              rules={{ required: "Vui lòng chọn khu vực!" }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.area}>
                  <InputLabel>Khu vực (Tầng)</InputLabel>
                  <Select
                    {...field}
                    label="Khu vực (Tầng)"
                    disabled={areas.length === 0}
                  >
                    {areas.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.area && (
                    <Typography color="error" variant="caption">
                      {errors.area.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
            <DialogActions>
              <Button
                onClick={handleClose}
                color="inherit"
                variant="outlined"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {editingTable ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableFormModalView;