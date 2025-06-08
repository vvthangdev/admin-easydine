"use client";

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
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import { Upload, Button as AntButton } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { User, Mail, AtSign, Phone, Home, Shield, Lock } from "lucide-react";
import {
  dialogStyles,
  inputStyles,
  buttonStyles,
  typography,
  colors,
  boxStyles,
} from "../../../styles"; // Import styles từ index.js

const UserFormModalView = ({
  visible,
  onOk,
  onCancel,
  form,
  editingUser,
  avatar,
  onUploadChange,
  handleFieldChange,
  handleRoleChange,
  errors,
}) => {
  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      PaperProps={{ sx: dialogStyles.paper }}
    >
      {" "}
      {/* Sử dụng dialogStyles.paper */}
      <DialogTitle sx={dialogStyles.title}>
        {" "}
        {/* Sử dụng dialogStyles.title */}
        {editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
      </DialogTitle>
      <DialogContent sx={dialogStyles.content}>
        {" "}
        {/* Sử dụng dialogStyles.content */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...boxStyles.buttonGroup,
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            {" "}
            {/* Sử dụng boxStyles.buttonGroup */}
            <User size={20} color={colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: colors.neutral[800], ...typography.subtitle1 }}
            >
              Thông tin cá nhân
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Tên"
            name="name"
            value={form.name || ""}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.name}
            helperText={errors.name || ""}
            sx={inputStyles.textField} // Sử dụng inputStyles.textField
            InputProps={{
              startAdornment: (
                <User
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email || ""}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.email}
            helperText={errors.email || ""}
            sx={inputStyles.textField} // Sử dụng inputStyles.textField
            InputProps={{
              startAdornment: (
                <Mail
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username || ""}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.username}
            helperText={errors.username || ""}
            sx={inputStyles.textField} // Sử dụng inputStyles.textField
            InputProps={{
              startAdornment: (
                <AtSign
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...boxStyles.buttonGroup,
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            {" "}
            {/* Sử dụng boxStyles.buttonGroup */}
            <Phone size={20} color={colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: colors.neutral[800], ...typography.subtitle1 }}
            >
              Thông tin liên hệ
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={form.phone || ""}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            error={!!errors.phone}
            helperText={errors.phone || ""}
            sx={inputStyles.textField} // Sử dụng inputStyles.textField
            InputProps={{
              startAdornment: (
                <Phone
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={form.address || ""}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            sx={inputStyles.textField} // Sử dụng inputStyles.textField
            InputProps={{
              startAdornment: (
                <Home
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...boxStyles.buttonGroup,
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            {" "}
            {/* Sử dụng boxStyles.buttonGroup */}
            <Shield size={20} color={colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: colors.neutral[800], ...typography.subtitle1 }}
            >
              Quyền hạn và bảo mật
            </Typography>
          </Box>

          <FormControl
            fullWidth
            margin="dense"
            size="small"
            required
            error={!!errors.role}
            sx={inputStyles.select}
          >
            {" "}
            {/* Sử dụng inputStyles.select */}
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={form.role || ""}
              onChange={handleRoleChange}
              startAdornment={
                <Shield
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8, marginLeft: -4 }}
                />
              }
              label="Vai trò"
            >
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="STAFF">Nhân viên</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </Select>
            {errors.role && (
              <FormHelperText error>{errors.role}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: colors.neutral[800], ...typography.body2 }}
            >
              Ảnh đại diện
            </Typography>
            <Upload
              listType="picture"
              fileList={avatar}
              onChange={onUploadChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <AntButton
                icon={<UploadOutlined />}
                style={{
                  height: 36,
                  borderRadius: 8,
                  borderColor: colors.primary.main, // Sử dụng colors.primary.main
                  color: colors.primary.main, // Sử dụng colors.primary.main
                }}
              >
                Tải lên ảnh đại diện
              </AntButton>
            </Upload>
          </Box>

          <TextField
            fullWidth
            label="Mật khẩu mới (để trống nếu không đổi)"
            name="password"
            type="password"
            autoComplete="off"
            value={form.password || ""}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            error={!!errors.password}
            helperText={errors.password || ""}
            sx={inputStyles.textField}
            InputProps={{
              startAdornment: (
                <Lock
                  size={16}
                  color={colors.primary.main}
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={dialogStyles.actions}>
        <Button
          onClick={onCancel}
          sx={buttonStyles.outlined}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button onClick={onOk} sx={buttonStyles.primary} variant="contained">
          {editingUser ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModalView;
