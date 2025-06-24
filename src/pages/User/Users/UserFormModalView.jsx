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
import { useAppleStyles } from '../../../theme/theme-hooks';

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
  const styles = useAppleStyles();

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      PaperProps={{ sx: styles.modal?.paper }}
    >
      <DialogTitle sx={styles.modal?.title}>
        {editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
      </DialogTitle>
      <DialogContent sx={styles.modal?.content}>
        <Box sx={{ mb: styles.spacing(2) }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: styles.spacing(2),
              gap: styles.spacing(2),
            }}
          >
            <User size={20} color={styles.colors?.primary?.main || '#0071e3'} />
            <Typography
              variant="subtitle1"
              sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.subtitle1 }}
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <User size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <Mail size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <AtSign size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: styles.spacing(3) }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: styles.spacing(2),
              gap: styles.spacing(2),
            }}
          >
            <Phone size={20} color={styles.colors?.primary?.main || '#0071e3'} />
            <Typography
              variant="subtitle1"
              sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.subtitle1 }}
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <Phone size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <Home size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ mb: styles.spacing(3) }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: styles.spacing(2),
              gap: styles.spacing(2),
            }}
          >
            <Shield size={20} color={styles.colors?.primary?.main || '#0071e3'} />
            <Typography
              variant="subtitle1"
              sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.subtitle1 }}
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
            sx={styles.input('default')}
          >
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={form.role || ''}
              onChange={handleRoleChange}
              label="Vai trò"
            >
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="STAFF">Nhân viên</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </Select>
            {errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
          </FormControl>

          <Box sx={{ mb: styles.spacing(2) }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.body2 }}
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
                  borderRadius: styles.rounded('lg'),
                  borderColor: styles.colors?.primary?.main || '#0071e3',
                  color: styles.colors?.primary?.main || '#0071e3',
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
            sx={styles.input('default')}
            InputProps={{
              startAdornment: (
                <Lock size={16} color={styles.colors?.primary?.main || '#0071e3'} style={{ marginRight: 8 }} />
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={styles.modal?.actions}>
        <Button
          onClick={onCancel}
          sx={styles.button('outline')}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onOk}
          sx={styles.button('primary')}
          variant="contained"
        >
          {editingUser ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModalView;