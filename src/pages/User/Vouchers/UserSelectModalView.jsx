'use client';

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
} from '@mui/material';
import { Search, UserPlus } from 'lucide-react';
import UserSelectModalViewModel from './UserSelectModalViewModel';
import { theme } from '../../../styles'; // Chỉ import theme cho colors và avatarStyles

const UserSelectModalView = ({
  visible,
  onOk,
  onCancel,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const {
    filteredUsers,
    loading,
    inputValue,
    handleSearch,
    handleEnterSearch,
    handleSelectUser,
  } = UserSelectModalViewModel({
    visible,
    selectedUsers,
    setSelectedUsers,
    setSnackbar,
  });

  const columns = [
    { id: 'select', label: '', width: '5%' },
    { id: 'avatar', label: 'Ảnh', width: '10%' },
    { id: 'name', label: 'Tên', width: '35%' },
    { id: 'username', label: 'Tên người dùng', width: '50%' },
  ];

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <UserPlus size={20} color={theme.colors.primary.main} />
          <Typography variant="subtitle1">Chọn người dùng</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEnterSearch(e.target.value);
            }
          }}
          fullWidth
          size="small"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={theme.colors.primary.main} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ width: column.width }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: theme.colors.neutral[100],
                          }}
                        >
                          <img
                            src={user.avatar || '/placeholder.svg?height=24&width=24'}
                            alt={user.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder.svg?height=24&width=24';
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                      <TableCell sx={{ color: theme.colors.neutral[400] }}>
                        {user.username}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {loading ? 'Đang tải...' : 'Không có dữ liệu'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Đã chọn {selectedUsers.length} người dùng
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Hủy
        </Button>
        <Button onClick={onOk} variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectModalView;