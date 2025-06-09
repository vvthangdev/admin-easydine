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
import { useAppleStyles } from '../../../theme/theme-hooks';

const UserSelectModalView = ({
  visible,
  onOk,
  onCancel,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const styles = useAppleStyles();
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
      PaperProps={{ sx: styles.modal?.paper }}
    >
      <DialogTitle sx={styles.modal?.title}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2) }}>
          <UserPlus size={20} color={styles.colors?.primary?.main || '#0071e3'} />
          <Typography variant="subtitle1">Chọn người dùng</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={styles.modal?.content}>
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
          sx={styles.input('default')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={styles.colors?.primary?.main || '#0071e3'} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: styles.spacing(4) }}>
            <CircularProgress size={24} sx={{ color: styles.colors?.primary?.main || '#0071e3' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={styles.components?.table?.container}>
            <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
              <TableHead sx={styles.components?.table?.head}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ ...styles.components?.table?.cell, width: column.width }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} sx={styles.components?.table?.row}>
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
                            backgroundColor: styles.colors?.neutral?.[100] || '#f5f5f5',
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
                      <TableCell sx={{ color: styles.colors?.neutral?.[400] || '#9e9e9e' }}>
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

        <Box sx={{ mt: styles.spacing(2), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Đã chọn {selectedUsers.length} người dùng
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.modal?.actions}>
        <Button onClick={onCancel} variant="outlined" sx={styles.button('outline')}>
          Hủy
        </Button>
        <Button onClick={onOk} variant="contained" sx={styles.button('primary')}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectModalView;