'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { LayoutDashboard, Table, ShoppingBag, MenuIcon, Users, MessageSquare, Home } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

export default function Sidebar({ onCollapseChange }) {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    onCollapseChange(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const menuItems = [
    {
      path: '/overview',
      label: 'Tổng quan',
      icon: <LayoutDashboard size={20} />,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      path: '/tables',
      label: 'Quản lý bàn',
      icon: <Table size={20} />,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      path: '/orders',
      label: 'Đơn hàng',
      icon: <ShoppingBag size={20} />,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      path: '/items',
      label: 'Quản lý menu',
      icon: <MenuIcon size={20} />,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      path: '/users',
      label: 'Quản lý người dùng',
      icon: <Users size={20} />,
      roles: ['ADMIN'],
    },
    {
      path: '/cancel-items',
      label: 'Quản lý liên hệ',
      icon: <MessageSquare size={20} />,
      roles: ['ADMIN'],
    },
  ];

  const filteredMenuItems = user ? menuItems.filter(item => item.roles.includes(user.role)) : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isCollapsed ? '72px' : '256px',
        height: 'calc(100vh - 64px)',
        backgroundColor: theme.palette.background.paper || '#ffffff',
        boxShadow: theme.shadows.sm,
        position: 'fixed',
        top: '64px',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
        zIndex: theme.zIndex?.appBar || 10,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          p: theme.spacing[2],
          borderBottom: `1px solid ${theme.palette.divider || '#e5e5ea'}`,
        }}
      >
        {!isCollapsed && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], flexShrink: 0 }}>
            <Avatar
              src={user?.avatar || '/Assets/Header/avtprivate.jpg'}
              alt="User"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `1px solid ${theme.palette.primary[200] || '#c0e0ff'}`,
                transition: theme.transitions.create('border-color'),
                '&:hover': {
                  borderColor: theme.palette.primary.main || '#0071e3',
                },
              }}
            />
            <Box sx={{ minWidth: 0, maxWidth: '160px' }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary || '#1d1d1f',
                  fontWeight: theme.typography.fontWeightMedium || 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary || '#636366',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.role === 'ADMIN' ? 'Administrator' : 'Staff'}
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            color: theme.palette.primary.main || '#0071e3',
            borderRadius: '50%',
            bgcolor: theme.palette.primary[50] || '#e6f3ff',
            '&:hover': {
              bgcolor: theme.palette.primary[100] || '#c0e0ff',
              transform: 'scale(1.05)',
            },
            transition: theme.transitions.create(['background-color', 'transform']),
          }}
        >
          {isCollapsed ? <RightOutlined style={{ fontSize: '16px' }} /> : <LeftOutlined style={{ fontSize: '16px' }} />}
        </IconButton>
      </Box>

      <Box sx={{ mt: theme.spacing[2], px: theme.spacing[1], flexGrow: 1 }}>
        {filteredMenuItems.map((item, index) => (
          <Link key={index} to={item.path} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[1.5],
                px: theme.spacing[1],
                py: theme.spacing[1.2],
                my: theme.spacing[0.5],
                borderRadius: theme.shape.borderRadius,
                color: location.pathname === item.path ? theme.palette.primary.main || '#0071e3' : theme.palette.text.secondary || '#636366',
                bgcolor: location.pathname === item.path ? theme.palette.primary[50] || '#e6f3ff' : 'transparent',
                boxShadow: location.pathname === item.path ? theme.shadows.xs : 'none',
                transition: theme.transitions.create(['background-color', 'color', 'transform']),
                '&:hover': {
                  bgcolor: theme.palette.primary[50] || '#e6f3ff',
                  color: theme.palette.primary.main || '#0071e3',
                  transform: 'translateX(3px)',
                },
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                minHeight: '44px',
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? theme.palette.primary.main || '#0071e3' : theme.palette.text.secondary || '#636366',
                }}
              >
                {item.icon}
              </Box>
              {!isCollapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeightMedium || 500,
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          </Link>
        ))}
      </Box>

      <Box
        sx={{
          p: theme.spacing[1],
          borderTop: `1px solid ${theme.palette.divider || '#e5e5ea'}`,
          boxSizing: 'border-box',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1.5],
              px: theme.spacing[1],
              py: theme.spacing[1.2],
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.text.secondary || '#636366',
              '&:hover': {
                bgcolor: theme.palette.primary[50] || '#e6f3ff',
                color: theme.palette.primary.main || '#0071e3',
                transform: 'translateX(3px)',
              },
              transition: theme.transitions.create(['background-color', 'color', 'transform']),
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: '44px',
            }}
          >
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} />
            </Box>
            {!isCollapsed && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: theme.typography.fontWeightMedium || 500,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Về trang chủ
              </Typography>
            )}
          </Box>
        </Link>
      </Box>
    </Box>
  );
}