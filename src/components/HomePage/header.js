import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';
import { userAPI } from '../../services/apis/User';

export default function Header({ logo, navLinks }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Thêm state để quản lý vị trí dropdown

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUserInfo();
      console.log('check res:', response);
      setProfile(response);
    } catch (error) {
      message.error('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token.split(' ')[1]);
          setUser(decoded);
          console.log('Decoded token:', decoded);
          if (decoded?.payload?.role === 'ADMIN') {
            setIsAdmin(true);
          }
          setIsLoggedIn(true);
          fetchProfile();
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.error('Token is not available');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setIsDropdownOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      message.error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Lưu vị trí của nút avatar
    setIsDropdownOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsDropdownOpen(false);
  };

  console.log('check profile', profile);

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <img src={logo} alt="Restaurant Logo" style={{ height: 40, borderRadius: 8 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {navLinks.map((link, index) => (
            <Button
              key={index}
              component={Link}
              to={link.path}
              sx={{ color: 'text.primary', textTransform: 'none', '&:hover': { color: 'primary.main' } }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Đang tải...
          </Typography>
        ) : (
          <>
            {isAdmin && (
              <Button
                component={Link}
                to="/admin"
                sx={{ color: 'primary.main', textTransform: 'none' }}
              >
                Admin
              </Button>
            )}
            {isLoggedIn ? (
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt="Profile"
                    src={profile?.avatar || 'path/to/default/avatar.png'}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography sx={{ ml: 1, color: 'text.primary' }}>{user?.username}</Typography>
                  <ExpandMore sx={{ ml: 1, transition: 'transform 0.3s', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={isDropdownOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Đặt menu ngay dưới avatar
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }} // Đỉnh của menu căn giữa với avatar
                  PaperProps={{ sx: { borderRadius: 2, mt: 1 } }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
                    Đơn hàng của tôi
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
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
                  color="primary"
                  sx={{ borderRadius: 1, textTransform: 'none', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 1, textTransform: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}