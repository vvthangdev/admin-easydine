// UserVoucherManagementView.jsx (đã được tách trước đó)
"use client";

import { Box, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import UserScreen from "./Users/UserScreenView";
import VoucherScreenView from "./Vouchers/VoucherScreenView";
import UserVoucherManagementViewModel from "./UserVoucherManagementViewModel";

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
        p: 4,
        background: "linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)",
        minHeight: "100vh",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at top left, rgba(0, 122, 255, 0.05), transparent 70%)",
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
              backgroundColor: "#0071e3",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: "#86868b",
              fontSize: "0.9rem",
              "&.Mui-selected": {
                color: "#0071e3",
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
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            "& .MuiAlert-icon": {
              color:
                snackbar.severity === "success"
                  ? "#34c759"
                  : snackbar.severity === "error"
                    ? "#ff3b30"
                    : snackbar.severity === "warning"
                      ? "#ff9500"
                      : "#0071e3",
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