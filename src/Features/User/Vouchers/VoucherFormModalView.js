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
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  FormHelperText,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import viLocale from "date-fns/locale/vi"
import { Ticket, Calendar, Percent, DollarSign, Users, UserPlus, Trash2 } from "lucide-react"
import UserSelectModalView from "./UserSelectModalView"
import VoucherFormModalViewModel from "./VoucherFormModalViewModel"

const VoucherFormModalView = ({
  visible,
  onOk,
  onCancel,
  form,
  editingVoucher,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
  allUsers,
}) => {
  const { userSelectModalOpen, setUserSelectModalOpen, handleFieldChange, handleRemoveUser, handleAddUsers } =
    VoucherFormModalViewModel({
      form,
      editingVoucher,
      selectedUsers,
      setSelectedUsers,
      setSnackbar,
    })

  const userColumns = [
    { id: "name", label: "Tên", width: "40%" },
    { id: "username", label: "Tên người dùng", width: "40%" },
    { id: "action", label: "Thao tác", width: "20%" },
  ]

  return (
    <>
      <Dialog
        open={visible}
        onClose={onCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            overflow: "hidden",
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
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Ticket size={20} color="#0071e3" />
          {editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Ticket size={20} color="#0071e3" />
              <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                Thông tin Voucher
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Mã Voucher"
              name="code"
              value={form.code || ""}
              onChange={(e) => handleFieldChange("code", e.target.value)}
              required
              margin="dense"
              size="small"
              error={!!form.touched?.code}
              helperText={form.touched?.code || ""}
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
                startAdornment: <Ticket size={16} color="#0071e3" style={{ marginRight: 8 }} />,
              }}
            />

            <TextField
              fullWidth
              label="Giảm giá"
              name="discount"
              type="number"
              value={form.discount || ""}
              onChange={(e) => handleFieldChange("discount", e.target.value)}
              required
              margin="dense"
              size="small"
              error={!!form.touched?.discount}
              helperText={form.touched?.discount || ""}
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
                startAdornment: <Percent size={16} color="#0071e3" style={{ marginRight: 8 }} />,
              }}
            />

            <FormControl
              fullWidth
              margin="dense"
              size="small"
              required
              error={!!form.touched?.discountType}
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
              <InputLabel>Loại giảm giá</InputLabel>
              <Select
                name="discountType"
                value={form.discountType || ""}
                onChange={(e) => handleFieldChange("discountType", e.target.value)}
                startAdornment={<Percent size={16} color="#0071e3" style={{ marginRight: 8, marginLeft: -4 }} />}
              >
                <MenuItem value="percentage">Phần trăm</MenuItem>
                <MenuItem value="fixed">Cố định</MenuItem>
              </Select>
              {!!form.touched?.discountType && <FormHelperText>{form.touched?.discountType}</FormHelperText>}
            </FormControl>

            <TextField
              fullWidth
              label="Đơn tối thiểu (VNĐ)"
              name="minOrderValue"
              type="number"
              value={form.minOrderValue || 0}
              onChange={(e) => handleFieldChange("minOrderValue", e.target.value)}
              margin="dense"
              size="small"
              error={!!form.touched?.minOrderValue}
              helperText={form.touched?.minOrderValue || ""}
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
                startAdornment: <DollarSign size={16} color="#0071e3" style={{ marginRight: 8 }} />,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Calendar size={20} color="#0071e3" />
              <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                Thời gian hiệu lực
              </Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DatePicker
                label="Ngày bắt đầu"
                value={form.startDate || null}
                onChange={(date) => handleFieldChange("startDate", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    size: "small",
                    error: !!form.touched?.startDate,
                    helperText: form.touched?.startDate || "",
                    sx: {
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
                    },
                    InputProps: {
                      startAdornment: <Calendar size={16} color="#0071e3" style={{ marginRight: 8 }} />,
                    },
                  },
                }}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={form.endDate || null}
                onChange={(date) => handleFieldChange("endDate", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    size: "small",
                    error: !!form.touched?.endDate,
                    helperText: form.touched?.endDate || "",
                    sx: {
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
                    },
                    InputProps: {
                      startAdornment: <Calendar size={16} color="#0071e3" style={{ marginRight: 8 }} />,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Users size={20} color="#0071e3" />
              <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                Cài đặt sử dụng
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive || false}
                  onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#0071e3",
                      "&:hover": {
                        backgroundColor: "rgba(0, 113, 227, 0.08)",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#0071e3",
                    },
                  }}
                />
              }
              label="Kích hoạt"
              sx={{ mb: 2, "& .MuiTypography-root": { fontSize: "0.875rem" } }}
            />

            <TextField
              fullWidth
              label="Giới hạn sử dụng"
              name="usageLimit"
              type="number"
              value={form.usageLimit || ""}
              onChange={(e) => handleFieldChange("usageLimit", e.target.value)}
              margin="dense"
              size="small"
              error={!!form.touched?.usageLimit}
              helperText={form.touched?.usageLimit || "Để trống nếu không giới hạn"}
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
                startAdornment: <Users size={16} color="#0071e3" style={{ marginRight: 8 }} />,
              }}
            />

            {editingVoucher && (
              <TextField
                fullWidth
                label="Số lượt sử dụng"
                name="usedCount"
                type="number"
                value={form.usedCount || 0}
                disabled
                margin="dense"
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                  },
                }}
                InputProps={{
                  startAdornment: <Users size={16} color="#86868b" style={{ marginRight: 8 }} />,
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <UserPlus size={20} color="#0071e3" />
                <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                  Người dùng áp dụng
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<UserPlus size={16} />}
                onClick={() => setUserSelectModalOpen(true)}
                sx={{
                  borderColor: "#0071e3",
                  color: "#0071e3",
                  borderRadius: 28,
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  "&:hover": {
                    borderColor: "#0071e3",
                    background: "rgba(0, 113, 227, 0.05)",
                  },
                }}
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 280, // Tăng chiều cao tối đa
                minHeight: 120, // Chiều cao tối thiểu
                boxShadow: "none",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                borderRadius: 3,
                overflow: "auto", // Đảm bảo có thanh cuộn
                // Custom scroll bar styling
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 113, 227, 0.3)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(0, 113, 227, 0.5)',
                  },
                },
              }}
            >
              <Table stickyHeader sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(0, 113, 227, 0.05)" }}>
                    {userColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          width: column.width,
                          fontWeight: 600,
                          color: "#1d1d1f",
                          py: 1,
                          fontSize: "0.75rem",
                          position: 'sticky',
                          top: 0,
                          backgroundColor: "rgba(0, 113, 227, 0.05)",
                          zIndex: 1,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedUsers.length > 0 ? (
                    selectedUsers
                      .map((userId) => {
                        const user = allUsers.find((u) => u._id === userId)
                        return user ? (
                          <TableRow
                            key={userId}
                            sx={{
                              "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                              transition: "background-color 0.2s",
                            }}
                          >
                            <TableCell sx={{ 
                              fontSize: "0.75rem", 
                              py: 1.5, 
                              fontWeight: 500, 
                              color: "#1d1d1f",
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {user.name}
                            </TableCell>
                            <TableCell sx={{ 
                              fontSize: "0.75rem", 
                              py: 1.5, 
                              color: "#86868b",
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {user.username}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem", py: 1.5 }}>
                              <Tooltip title="Xóa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveUser(userId)}
                                  sx={{
                                    color: "#ff3b30",
                                    "&:hover": {
                                      backgroundColor: "rgba(255, 59, 48, 0.1)",
                                    },
                                  }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ) : null
                      })
                      .filter(Boolean)
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: "#86868b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {selectedUsers.length === 0
                          ? "Voucher áp dụng cho tất cả người dùng"
                          : "Không có người dùng được chọn"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ color: "#86868b", mt: 1, display: "block" }}>
              {selectedUsers.length === 0
                ? "Không chọn người dùng nào sẽ áp dụng voucher cho tất cả người dùng"
                : `Đã chọn ${selectedUsers.length} người dùng`}
            </Typography>
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
            {editingVoucher ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
      <UserSelectModalView
        visible={userSelectModalOpen}
        onOk={() => setUserSelectModalOpen(false)}
        onCancel={() => setUserSelectModalOpen(false)}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleAddUsers}
        setSnackbar={setSnackbar}
      />
    </>
  )
}

export default VoucherFormModalView