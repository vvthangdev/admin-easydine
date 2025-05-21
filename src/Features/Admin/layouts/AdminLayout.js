import Sidebar from "../../../components/Admin/sidebar";
import { Outlet } from 'react-router-dom';
import Header from "../../../components/HomePage/Header";
import { Box, Typography, Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

function AdminLayout() {
  const navLinks = [{ path: "/", label: "Trang chủ" }];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, bgcolor: 'background.paper', boxShadow: 1, height: '64px' }}>
        <Header logo="/Assets/Header/logo2.png" navLinks={navLinks} />
      </Box>

      <Box sx={{ display: 'flex', flex: 1, mt: '64px' }}>
        <Box sx={{ position: 'fixed', top: '64px', bottom: 0, zIndex: 10 }}>
          <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        </Box>

        <Box sx={{ flex: 1, ml: isSidebarCollapsed ? '64px' : '240px', transition: 'margin-left 0.5s ease-in-out' }}>
          <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: 'calc(100vh - 128px)' }}>
            <Outlet />
          </Box>

          <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © 2024 Restaurant Admin. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;