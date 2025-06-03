"use client";

import { Box, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import UserScreen from "./Users/UserScreenView";
import VoucherScreenView from "./Vouchers/VoucherScreenView";
import UserVoucherManagementViewModel from "./UserVoucherManagementViewModel";

import { boxStyles, typography, colors, shadows } from "../../styles/index";

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
    <Box
      sx={{
        ...boxStyles.pageContainer, // Sử dụng style container chung
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at top left, rgba(0, 122, 255, 0.05), transparent 70%)",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: colors.primary.main,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: colors.neutral[400],
              fontSize: typography.body2.fontSize,
              "&.Mui-selected": {
                color: colors.primary.main,
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Người dùng" />
          <Tab label="Voucher" />
        </Tabs>

        <Box
          sx={{
            ...boxStyles.card, // Dùng style card chung
            borderRadius: 4,
            p: 3,
          }}
        >
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            boxShadow: shadows.medium,
            "& .MuiAlert-icon": {
              color:
                snackbar.severity === "success"
                  ? colors.success.main
                  : snackbar.severity === "error"
                  ? colors.error.main
                  : snackbar.severity === "warning"
                  ? colors.warning.main
                  : colors.primary.main,
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
