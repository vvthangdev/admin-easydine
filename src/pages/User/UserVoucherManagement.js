'use client';

import { Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import UserScreen from './Users/UserScreenView';
import VoucherScreenView from './Vouchers/VoucherScreenView';
import UserVoucherManagementViewModel from './UserVoucherManagementViewModel';
import { theme } from '../../styles'; // Chỉ import theme cho colors và shadows

const UserVoucherManagementView = () => {
  const {
    activeTab,
    selectedUsers,
    snackbar,
    handleTabChange,
    setSelectedUsers,
    setSnackbar,
  } = UserVoucherManagementViewModel();

  return (
    <Box sx={{
  backgroundColor: theme.colors.neutral[50], // Thêm nền
  position: 'relative',
  minHeight: '100vh', // Đảm bảo chiều cao
}}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: theme.colors.primary.main,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              color: theme.colors.neutral[400],
              '&.Mui-selected': {
                color: theme.colors.primary.main,
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Người dùng" />
          <Tab label="Voucher" />
        </Tabs>

        <Box sx={{ borderRadius: 4, p: 3 }}>
          {activeTab === 0 && (
            <UserScreen
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setSnackbar={setSnackbar}
            />
          )}
          {activeTab === 1 && (
            <VoucherScreenView
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setSnackbar={setSnackbar}
            />
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows.medium,
            '& .MuiAlert-icon': {
              color:
                snackbar.severity === 'success'
                  ? theme.colors.success.main
                  : snackbar.severity === 'error'
                  ? theme.colors.error.main
                  : snackbar.severity === 'warning'
                  ? theme.colors.warning.main
                  : theme.colors.primary.main,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserVoucherManagementView;