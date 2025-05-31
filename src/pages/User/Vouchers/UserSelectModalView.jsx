"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material"
import { Search, UserPlus } from 'lucide-react'
import UserSelectModalViewModel from "./UserSelectModalViewModel"

const UserSelectModalView = ({ visible, onOk, onCancel, selectedUsers, setSelectedUsers, setSnackbar }) => {
  const { filteredUsers, loading, inputValue, handleSearch, handleEnterSearch, handleSelectUser } =
    UserSelectModalViewModel({
      visible,
      selectedUsers,
      setSelectedUsers,
      setSnackbar,
    })

  const columns = [
    { id: "select", label: "", width: "5%" },
    { id: "avatar", label: "Ảnh", width: "10%" },
    { id: "name", label: "Tên", width: "35%" },
    { id: "username", label: "Tên người dùng", width: "50%" },
  ]

  return (
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
        <UserPlus size={20} color="#0071e3" />
        Chọn người dùng
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEnterSearch(e.target.value)
            }
          }}
          fullWidth
          size="small"
          autoComplete="off"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 40,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0071e3",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0071e3",
                borderWidth: 2,
              },
              "& .MuiInputBase-input": {
                fontSize: "0.875rem",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#0071e3",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#0071e3" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#0071e3" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400,
              boxShadow: "none",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Table stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 113, 227, 0.05)" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        width: column.width,
                        fontWeight: 600,
                        color: "#1d1d1f",
                        py: 1.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          size="small"
                          sx={{
                            color: "#0071e3",
                            "&.Mui-checked": {
                              color: "#0071e3",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "#f5f5f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={user.avatar || "/placeholder.svg?height=24&width=24"}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=24&width=24"
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 1, fontWeight: 500, color: "#1d1d1f" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 1, color: "#86868b" }}>{user.username}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "#86868b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {loading ? "Đang tải..." : "Không có dữ liệu"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#86868b" }}>
            Đã chọn {selectedUsers.length} người dùng
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
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserSelectModalView
