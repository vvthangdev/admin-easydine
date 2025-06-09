'use client';

import { memo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { userAPI } from '../../services/apis/User';
import { useAuth } from '../../contexts/AuthContext';

function Header({ logo, navLinks }) {
  const theme = useTheme();
  const { user, loading: authLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchProfile = useCallback(async () => {
    if (profile) return;
    setLoading(true);
    try {
      const response = await userAPI.getUserInfo();
      setProfile(response);
    } catch (error) {
      setSnackbarMessage('Lỗi khi tải thông tin hồ sơ');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    if (!profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      window.location.reload();
    } catch (error) {
      setSnackbarMessage('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
      setSnackbarOpen(true);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsDropdownOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsDropdownOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: theme.spacing.md,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <Box>
            <img
              src={logo}
              alt="Restaurant Logo"
              style={{
                height: 40,
                borderRadius: theme.shape.borderRadius,
               
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: theme.spacing.lg }}>
            {navLinks.map((link, index) => (
              <Button
                key={index}
                component={Link}
                to={link.path}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          {authLoading || loading ? (
            <Typography variant="body2" color={theme.palette.text.disabled}>
              Đang tải...
            </Typography>
          ) : (
            <>
              {user && (
                <Button
                  component={Link}
                  to="/overview"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': { color: theme.palette.primary.dark },
                  }}
                >
                  Dashboard
                </Button>
              )}
              {user ? (
                <Box sx={{ position: 'relative' }}>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      alt="Profile"
                      src={profile?.avatar || '/path/to/default/avatar.png'}
                      sx={{
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Typography
                      sx={{
                        ml: 1,
                        color: theme.palette.text.primary,
                        fontWeight: theme.typography.fontWeightMedium || 500,
                      }}
                    >
                      {user.name}
                    </Typography>
                    <ExpandMore
                      sx={{
                        ml: 1,
                        color: theme.palette.text.disabled,
                        transition: theme.transitions.create('transform'),
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={isDropdownOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleMenuClose}
                      sx={{
                        color: theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    >
                      Thông tin cá nhân
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/orders"
                      onClick={handleMenuClose}
                      sx={{
                        color: theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    >
                      Đơn hàng của tôi
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      borderRadius: theme.shape.borderRadius,
                      '&:hover': {
                        backgroundColor: theme.palette.primary[50],
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderRadius: theme.shape.borderRadius,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={theme.transitions.duration.short}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity="error"
          onClose={handleSnackbarClose}
          sx={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default memo(Header);