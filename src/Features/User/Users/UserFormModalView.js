"use client"

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
} from "@mui/material"
import { Upload, Button as AntButton } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { User, Mail, AtSign, Phone, Home, Shield, Lock } from 'lucide-react'

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
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
          overflow: "hidden",
          maxWidth: 500,
          width: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          background: "linear-gradient(145deg, rgba(0, 113, 227, 0.05) 0%, rgba(0, 113, 227, 0.1) 100%)",
          color: "#1d1d1f",
          fontWeight: 600,
          fontFamily: '"SF Pro Display", Roboto, sans-serif',
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          fontSize: "1.1rem",
        }}
      >
        {editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <User size={20} color="#0071e3" />
            <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
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
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <User size={16} color="#0071e3" style={{ marginRight: 8 }} />,
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
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <Mail size={16} color="#0071e3" style={{ marginRight: 8 }} />,
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
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <AtSign size={16} color="#0071e3" style={{ marginRight: 8 }} />,
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Phone size={20} color="#0071e3" />
            <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
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
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <Phone size={16} color="#0071e3" style={{ marginRight: 8 }} />,
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
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <Home size={16} color="#0071e3" style={{ marginRight: 8 }} />,
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Shield size={20} color="#0071e3" />
            <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
              Quyền hạn và bảo mật
            </Typography>
          </Box>

          <FormControl
            fullWidth
            margin="dense"
            size="small"
            required
            error={!!errors.role}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
          >
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={form.role || ""}
              onChange={handleRoleChange}
              startAdornment={<Shield size={16} color="#0071e3" style={{ marginRight: 8, marginLeft: -4 }} />}
              label="Vai trò"
            >
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="STAFF">Nhân viên</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </Select>
            {errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "#1d1d1f" }}>
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
                  borderColor: "#0071e3",
                  color: "#0071e3",
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0071e3",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0071e3",
              },
            }}
            InputProps={{
              startAdornment: <Lock size={16} color="#0071e3" style={{ marginRight: 8 }} />,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <Button
          onClick={onCancel}
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
          onClick={onOk}
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
            },
            transition: "all 0.3s ease",
          }}
          variant="contained"
        >
          {editingUser ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserFormModalView
