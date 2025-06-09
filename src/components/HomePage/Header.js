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
import { useAppleStyles } from '../../theme/theme-hooks';
import { userAPI } from '../../services/apis/User';
import { useAuth } from '../../contexts/AuthContext';

function Header({ logo, navLinks }) {
  const styles = useAppleStyles();
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

  const primaryColor = styles.colors?.primary?.main || '#0071e3';

  return (
    <>
      <Box
        component="header"
        sx={{
          ...styles.header("primary"),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          paddingY: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(4) }}>
          <Box>
            <img
              src={logo}
              alt="Restaurant Logo"
              style={{
                height: 40,
                borderRadius: styles.rounded("md"),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: styles.spacing(4) }}>
            {navLinks.map((link, index) => (
              <Button
                key={index}
                component={Link}
                to={link.path}
                sx={styles.button("ghost")}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(4) }}>
          {authLoading || loading ? (
            <Typography variant="body2" sx={{ color: styles.colors?.text?.disabled || '#c7c7cc' }}>
              Đang tải...
            </Typography>
          ) : (
            <>
              {user && (
                <Button
                  component={Link}
                  to="/overview"
                  sx={styles.button("primary")}
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
                        border: `2px solid ${primaryColor}`,
                      }}
                    />
                    <Typography
                      sx={{
                        ml: 1,
                        color: styles.colors?.text?.primary || '#1d1d1f',
                        fontWeight: 500,
                      }}
                    >
                      {user.name}
                    </Typography>
                    <ExpandMore
                      sx={{
                        ml: 1,
                        color: styles.colors?.text?.disabled || '#c7c7cc',
                        transition: 'transform 0.3s',
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
                    sx={styles.modal?.content}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleMenuClose}
                      sx={{
                        color: styles.colors?.text?.primary || '#1d1d1f',
                        '&:hover': {
                          backgroundColor: styles.colors?.background?.default || '#f5f5f7',
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
                        color: styles.colors?.text?.primary || '#1d1d1f',
                        '&:hover': {
                          backgroundColor: styles.colors?.background?.default || '#f5f5f7',
                        },
                      }}
                    >
                      Đơn hàng của tôi
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: styles.colors?.error?.main || '#ff2d55',
                        '&:hover': {
                          backgroundColor: styles.colors?.background?.default || '#f5f5f7',
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
                    sx={styles.button("outline")}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    sx={styles.button("primary")}
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
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity="error"
          onClose={handleSnackbarClose}
          sx={styles.status("error")}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default memo(Header);