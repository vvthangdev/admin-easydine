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
import {
  dialogStyles,
  buttonStyles,
  tableStyles,
  inputStyles,
  checkboxStyles,
  progressStyles,
  typography,
  colors,
  avatarStyles,
  
} from "../../../styles/index" // Import styles từ index.js

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
      PaperProps={{ sx: dialogStyles.paper }} // Sử dụng dialogStyles.paper
    >
      <DialogTitle sx={dialogStyles.title}>
        <UserPlus size={20} color={colors.primary.main} />
        Chọn người dùng
      </DialogTitle>
      <DialogContent sx={dialogStyles.content}>
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
          sx={inputStyles.textField} // Sử dụng inputStyles.textField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={colors.primary.main} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={progressStyles.primary} /> {/* Sử dụng progressStyles.primary */}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={tableStyles.container} // Sử dụng tableStyles.container
          >
            <Table stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead sx={tableStyles.head}> {/* Sử dụng tableStyles.head */}
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        ...tableStyles.cell, // Sử dụng tableStyles.cell
                        width: column.width,
                        fontWeight: 600, // Giữ fontWeight vì tableStyles.cell không có
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
                      sx={tableStyles.row} // Sử dụng tableStyles.row
                    >
                      <TableCell sx={tableStyles.cell}>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          size="small"
                          sx={checkboxStyles.default} // Sử dụng checkboxStyles.default
                        />
                      </TableCell>
                      <TableCell sx={tableStyles.cell}>
                        <Box sx={avatarStyles.userAvatar}> {/* Sử dụng avatarStyles.userAvatar */}
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
                      <TableCell sx={{ ...tableStyles.cell, fontWeight: 500 }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ ...tableStyles.cell, color: colors.neutral[400] }}>
                        {user.username}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={tableStyles.empty} // Sử dụng tableStyles.empty
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
          <Typography variant="body2" sx={{ color: colors.neutral[400], ...typography.body2 }}>
            Đã chọn {selectedUsers.length} người dùng
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={dialogStyles.actions}>
        <Button
          onClick={onCancel}
          sx={buttonStyles.outlined} // Sử dụng buttonStyles.outlined
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onOk}
          sx={buttonStyles.primary} // Sử dụng buttonStyles.primary
          variant="contained"
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserSelectModalView