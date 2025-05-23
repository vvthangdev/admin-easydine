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
} from "@mui/material";
import { Controller } from "react-hook-form";
import TableFormModalViewModel from "./TableFormModalViewModel";

const TableFormModalView = ({ open, onClose, onSubmit, editingTable, areas }) => {
  const { control, handleSubmit, reset, handleFormSubmit, handleClose } = TableFormModalViewModel({
    onClose,
    onSubmit,
    editingTable,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingTable ? "Sửa thông tin bàn" : "Thêm bàn mới"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="table_number"
            control={control}
            rules={{ required: "Vui lòng nhập số bàn!" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Số bàn"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="capacity"
            control={control}
            rules={{ required: "Vui lòng nhập sức chứa!" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Sức chứa"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="area"
            control={control}
            rules={{ required: "Vui lòng chọn hoặc nhập khu vực!" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                <InputLabel>Khu vực (Tầng)</InputLabel>
                <Select
                  {...field}
                  label="Khu vực (Tầng)"
                  placeholder="Chọn hoặc nhập khu vực (ví dụ: Tầng 1)"
                >
                  {areas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <Typography color="error" variant="caption">
                    {fieldState.error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          color="primary"
          variant="contained"
        >
          {editingTable ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableFormModalView;