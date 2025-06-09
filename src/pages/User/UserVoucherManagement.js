import { Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import UserScreen from './Users/UserScreenView';
import VoucherScreenView from './Vouchers/VoucherScreenView';
import UserVoucherManagementViewModel from './UserVoucherManagementViewModel';
import { useAppleStyles } from '../../theme/theme-hooks';

const UserVoucherManagementView = () => {
  const styles = useAppleStyles();
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
      backgroundColor: styles.colors?.neutral?.[50] || '#f5f5f5',
      position: 'relative',
      minHeight: '100vh',
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: styles.spacing(3),
            '& .MuiTabs-indicator': {
              backgroundColor: styles.colors?.primary?.main || '#0071e3',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              color: styles.colors?.neutral?.[400] || '#9e9e9e',
              '&.Mui-selected': {
                color: styles.colors?.primary?.main || '#0071e3',
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Người dùng" />
          <Tab label="Voucher" />
        </Tabs>

        <Box sx={{ borderRadius: styles.rounded('lg'), p: styles.spacing(3) }}>
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
            borderRadius: styles.rounded('md'),
            boxShadow: styles.shadows?.medium,
            '& .MuiAlert-icon': {
              color:
                snackbar.severity === 'success'
                  ? styles.colors?.success?.main || '#4caf50'
                  : snackbar.severity === 'error'
                  ? styles.colors?.error?.main || '#ff2d55'
                  : snackbar.severity === 'warning'
                  ? styles.colors?.warning?.main || '#ff9800'
                  : styles.colors?.primary?.main || '#0071e3',
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