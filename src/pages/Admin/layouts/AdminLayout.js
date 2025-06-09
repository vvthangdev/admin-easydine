import Sidebar from "../../../components/Admin/sidebar";
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useAppleStyles } from "../../../theme/theme-hooks"; // Import Apple styles

function AdminLayout({ children }) {
  const styles = useAppleStyles();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  console.log('[AdminLayout] Rendering with isSidebarCollapsed:', isSidebarCollapsed);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        mt: '64px' // Khoảng cách cho header từ AppRoutes
      }}>
        <Box sx={{ position: 'fixed', top: '64px', bottom: 0, zIndex: 10 }}>
          <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        </Box>

        <Box sx={{ 
          flex: 1, 
          ml: isSidebarCollapsed ? '72px' : '256px',
          transition: 'margin-left 0.3s ease-in-out'
        }}>
          <Box sx={{ 
            p: styles.spacing(3), // Sử dụng Apple spacing
            bgcolor: styles.colors?.background?.light || 'grey.100',
            minHeight: 'calc(100vh - 128px)'
          }}>
            {console.log('[AdminLayout] Rendering children:', children)}
            {children}
          </Box>

          <Box sx={{ 
            bgcolor: styles.colors?.background?.paper || 'background.paper',
            borderTop: `1px solid ${styles.colors?.neutral?.[100] || 'divider'}`,
            p: styles.spacing(2)
          }}>
            <Typography variant="body2" sx={{ color: styles.colors?.text?.secondary || 'text.secondary', textAlign: 'center' }}>
              © 2025 EasyDine - vvthang.dev. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;