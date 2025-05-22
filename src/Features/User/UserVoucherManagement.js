import React, { useState } from "react";
import { Box, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import UserScreen from "./Users/UserScreen";
import VoucherScreen from "./Vouchers/VoucherScreen";

const UserVoucherManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ marginBottom: "16px" }}
      >
        <Tab label="Người dùng" sx={{ fontSize: "0.85rem" }} />
        <Tab label="Voucher" sx={{ fontSize: "0.85rem" }} />
      </Tabs>
      {activeTab === 0 && (
        <UserScreen
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          setSnackbar={setSnackbar}
        />
      )}
      {activeTab === 1 && (
        <VoucherScreen
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          setSnackbar={setSnackbar}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserVoucherManagement;