import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, IconButton, Typography, Avatar } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function Sidebar({ onCollapseChange }) {
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
      path: '/admin',
      label: 'Tổng quan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      path: '/admin/tables',
      label: 'Quản lý bàn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/admin/orders',
      label: 'Đơn hàng',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      path: '/admin/menu',
      label: 'Quản lý menu',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      path: '/admin/users',
      label: 'Quản lý người dùng',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      path: '/admin/contacts',
      label: 'Quản lý liên hệ',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 20c-4.41 0-8-3.59-8-8h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.41-3.59 8-8 8z" />
        </svg>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? '64px' : '256px',
        height: 'calc(100vh - 64px)', // Adjust for fixed header
        background: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.9), rgba(0, 0, 0, 0.9))',
        color: 'white',
        transition: 'width 0.5s ease-in-out',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'fixed', // Ensure sidebar stays fixed
        top: '64px', // Align below header
        overflow: 'hidden', // Prevent content overflow
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Avatar
              src={user?.avatar || '/Assets/Header/avtprivate.jpg'}
              alt="Admin"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s',
                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'gray.100',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'gray.400',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Administrator
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            flexShrink: 0,
          }}
        >
          {isCollapsed ? <RightOutlined style={{ fontSize: '20px' }} /> : <LeftOutlined style={{ fontSize: '20px' }} />}
        </IconButton>
      </Box>

      <Box sx={{ mt: 2, px: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5, // Reduced gap for better alignment
                px: 1.5, // Reduced padding for collapsed state
                py: 1,
                my: 0.5,
                borderRadius: 2,
                color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.7)',
                bgcolor:
                  location.pathname === item.path
                    ? 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                    : 'transparent',
                boxShadow: location.pathname === item.path ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                border: location.pathname === item.path ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                },
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                minHeight: '48px', // Ensure consistent height
              }}
            >
              <Box sx={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </Box>
              {!isCollapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
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

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1,
              mx: 1,
              borderRadius: 2,
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              minHeight: '48px',
            }}
          >
            <Box sx={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Box>
            {!isCollapsed && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
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