import React from "react";
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
} from "@mui/material";
import { Upload, Button as AntButton } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UserFormModal = ({ visible, onOk, onCancel, form, editingUser, avatar, onUploadChange }) => {
  return (
    <Dialog open={visible} onClose={onCancel}>
      <DialogTitle sx={{ fontSize: "1rem" }}>Sửa thông tin người dùng</DialogTitle>
      <DialogContent sx={{ paddingTop: "8px !important" }}>
        <TextField
          fullWidth
          label="Tên"
          name="name"
          value={form.name || ""}
          onChange={(e) => form.setFieldsValue({ name: e.target.value })}
          required
          margin="dense"
          size="small"
          error={form.name === "" && form.touched?.name}
          helperText={form.name === "" && form.touched?.name ? "Vui lòng nhập tên!" : ""}
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email || ""}
          onChange={(e) => form.setFieldsValue({ email: e.target.value })}
          required
          margin="dense"
          size="small"
          error={form.email === "" && form.touched?.email}
          helperText={
            form.email === "" && form.touched?.email
              ? "Vui lòng nhập email!"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.touched?.email
              ? "Email không hợp lệ!"
              : ""
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username || ""}
          onChange={(e) => form.setFieldsValue({ username: e.target.value })}
          required
          margin="dense"
          size="small"
          error={form.username === "" && form.touched?.username}
          helperText={form.username === "" && form.touched?.username ? "Vui lòng nhập username!" : ""}
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
        <TextField
          fullWidth
          label="Số điện thoại"
          name="phone"
          value={form.phone || ""}
          onChange={(e) => form.setFieldsValue({ phone: e.target.value })}
          margin="dense"
          size="small"
          error={form.phone && !/^[0-9]{10}$/.test(form.phone) && form.touched?.phone}
          helperText={
            form.phone && !/^[0-9]{10}$/.test(form.phone) && form.touched?.phone
              ? "Số điện thoại phải có 10 chữ số!"
              : ""
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
        <TextField
          fullWidth
          label="Địa chỉ"
          name="address"
          value={form.address || ""}
          onChange={(e) => form.setFieldsValue({ address: e.target.value })}
          margin="dense"
          size="small"
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
        <FormControl fullWidth margin="dense" size="small" required>
          <InputLabel sx={{ fontSize: "0.85rem" }}>Vai trò</InputLabel>
          <Select
            name="role"
            value={form.role || ""}
            onChange={(e) => form.setFieldsValue({ role: e.target.value })}
            error={form.role === "" && form.touched?.role}
            sx={{ "& .MuiSelect-select": { fontSize: "0.85rem" } }}
          >
            <MenuItem value="CUSTOMER" sx={{ fontSize: "0.85rem" }}>Khách hàng</MenuItem>
            <MenuItem value="STAFF" sx={{ fontSize: "0.85rem" }}>Nhân viên</MenuItem>
            <MenuItem value="ADMIN" sx={{ fontSize: "0.85rem" }}>Quản trị viên</MenuItem>
          </Select>
        </FormControl>
        <div style={{ margin: "8px 0" }}>
          <Upload
            listType="picture"
            fileList={avatar}
            onChange={onUploadChange}
            beforeUpload={() => false}
          >
            <AntButton icon={<UploadOutlined />}>Tải lên ảnh đại diện</AntButton>
          </Upload>
        </div>
        <TextField
          fullWidth
          label="Mật khẩu mới (để trống nếu không đổi)"
          name="password"
          type="password"
          value={form.password || ""}
          onChange={(e) => form.setFieldsValue({ password: e.target.value })}
          margin="dense"
          size="small"
          error={form.password && form.password.length < 8 && form.touched?.password}
          helperText={
            form.password && form.password.length < 8 && form.touched?.password
              ? "Mật khẩu phải có ít nhất 8 ký tự!"
              : ""
          }
          sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ fontSize: "0.85rem" }}>Hủy</Button>
        <Button onClick={onOk} variant="contained" sx={{ fontSize: "0.85rem" }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;