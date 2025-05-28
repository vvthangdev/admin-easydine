// UserVoucherManagementViewModel.js
import { useState } from "react";

const UserVoucherManagementViewModel = () => {
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

  return {
    activeTab,
    selectedUsers,
    snackbar,
    handleTabChange,
    setSelectedUsers,
    setSnackbar,
  };
};

export default UserVoucherManagementViewModel;