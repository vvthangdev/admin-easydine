'use client';

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
} from '@mui/material';
import { Upload, Button as AntButton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { User, Mail, AtSign, Phone, Home, Shield, Lock } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      PaperProps={{ sx: theme.components.dialog.paper }}
    >
      <DialogTitle sx={theme.components.dialog.title}>
        {editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
      </DialogTitle>
      <DialogContent sx={theme.components.dialog.content}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...theme.components.box.buttonGroup,
              alignItems: 'center',
              mb: 2,
              gap: 2,
            }}
          >
            <User size={20} color={theme.colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: theme.colors.neutral[800], ...theme.typography.subtitle1 }}
            >
              Thông tin cá nhân
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Tên"
            name="name"
            value={form.name || ''}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.name}
            helperText={errors.name || ''}
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <User size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email || ''}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.email}
            helperText={errors.email || ''}
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <Mail size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username || ''}
            onChange={handleFieldChange}
            required
            margin="dense"
            size="small"
            error={!!errors.username}
            helperText={errors.username || ''}
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <AtSign size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...theme.components.box.buttonGroup,
              alignItems: 'center',
              mb: 2,
              gap: 2,
            }}
          >
            <Phone size={20} color={theme.colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: theme.colors.neutral[800], ...theme.typography.subtitle1 }}
            >
              Thông tin liên hệ
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={form.phone || ''}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            error={!!errors.phone}
            helperText={errors.phone || ''}
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <Phone size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />

          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={form.address || ''}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <Home size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              ...theme.components.box.buttonGroup,
              alignItems: 'center',
              mb: 2,
              gap: 2,
            }}
          >
            <Shield size={20} color={theme.colors.primary.main} />
            <Typography
              variant="subtitle1"
              sx={{ color: theme.colors.neutral[800], ...theme.typography.subtitle1 }}
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
            sx={theme.components.input.select}
          >
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={form.role || ''}
              onChange={handleRoleChange}
              startAdornment={
                <Shield
                  size={16}
                  color={theme.colors.primary.main}
                  style={{ marginRight: 8, marginLeft: -4 }}
                />
              }
              label="Vai trò"
            >
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="STAFF">Nhân viên</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </Select>
            {errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: theme.colors.neutral[800], ...theme.typography.body2 }}
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
                  borderRadius: theme.borderRadius.lg,
                  borderColor: theme.colors.primary.main,
                  color: theme.colors.primary.main,
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
            value={form.password || ''}
            onChange={handleFieldChange}
            margin="dense"
            size="small"
            error={!!errors.password}
            helperText={errors.password || ''}
            sx={theme.components.input.textField}
            InputProps={{
              startAdornment: (
                <Lock size={16} color={theme.colors.primary.main} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={theme.components.dialog.actions}>
        <Button
          onClick={onCancel}
          sx={theme.components.button.outlined}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onOk}
          sx={theme.components.button.primary}
          variant="contained"
        >
          {editingUser ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModalView;