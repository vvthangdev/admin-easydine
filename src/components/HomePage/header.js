import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';
import { userAPI } from '../../services/apis/User';
import colors from '../../theme/colors'; // Import brand colors

export default function Header({ logo, navLinks }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUserInfo();
      setProfile(response);
    } catch (error) {
      message.error('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setProfile(null);
      return;
    }
    try {
      const cleanToken = token.replace(/^Bearer\s+/, '');
      const decoded = jwtDecode(cleanToken);
      setUser(decoded);
      setIsLoggedIn(true);
      if (decoded?.payload?.role === 'ADMIN') {
        setIsAdmin(true);
      }
      fetchProfile();
    } catch (error) {
      if (refreshToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setIsDropdownOpen(false);
      window.location.reload();
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
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

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: colors.creamGold, // Cream Gold (#F5E6CC)
        boxShadow: `0 4px 16px rgba(0,0,0,0.1)`, // Softer shadow for elegance
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <img
            src={logo}
            alt="Restaurant Logo"
            style={{
              height: 40,
              borderRadius: 8,
              border: `1px solid ${colors.goldLuxe}`, // Gold Luxe (#D4A017)
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {navLinks.map((link, index) => (
            <Button
              key={index}
              component={Link}
              to={link.path}
              sx={{
                color: colors.navySapphire, // Navy Sapphire (#1C2526)
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { color: colors.goldLuxe }, // Gold Luxe (#D4A017)
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {loading ? (
          <Typography variant="body2" color={colors.silverMist}>
            Đang tải...
          </Typography>
        ) : (
          <>
            {isAdmin && (
              <Button
                component={Link}
                to="/admin"
                sx={{
                  color: colors.goldLuxe, // Gold Luxe (#D4A017)
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: colors.rubyWine }, // Ruby Wine (#8B1E3F)
                }}
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
                    sx={{
                      width: 32,
                      height: 32,
                      border: `2px solid ${colors.goldLuxe}`, // Gold Luxe (#D4A017)
                    }}
                  />
                  <Typography
                    sx={{
                      ml: 1,
                      color: colors.navySapphire, // Navy Sapphire (#1C2526)
                      fontWeight: 500,
                    }}
                  >
                    {user?.username}
                  </Typography>
                  <ExpandMore
                    sx={{
                      ml: 1,
                      color: colors.silverMist, // Silver Mist (#B0B3B8)
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
                  PaperProps={{
                    sx: {
                      bgcolor: colors.moonlightWhite, // Moonlight White (#F5F7FA)
                      border: `1px solid ${colors.goldLuxe}`, // Gold Luxe (#D4A017)
                      borderRadius: 2,
                      mt: 1,
                      boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                    sx={{
                      color: colors.navySapphire,
                      '&:hover': { bgcolor: colors.creamGold }, // Cream Gold (#F5E6CC)
                    }}
                  >
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/orders"
                    onClick={handleMenuClose}
                    sx={{
                      color: colors.navySapphire,
                      '&:hover': { bgcolor: colors.creamGold },
                    }}
                  >
                    Đơn hàng của tôi
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: colors.rubyWine, // Ruby Wine (#8B1E3F)
                      '&:hover': { bgcolor: colors.creamGold },
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
                    borderColor: colors.goldLuxe, // Gold Luxe (#D4A017)
                    color: colors.goldLuxe,
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: colors.moonlightWhite, // Moonlight White (#F5F7FA)
                      color: colors.navySapphire,
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
                    bgcolor: colors.goldLuxe, // Gold Luxe (#D4A017)
                    color: colors.obsidianBlack, // Obsidian Black (#121212)
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: colors.moonlightWhite, // Moonlight White (#F5F7FA)
                      color: colors.goldLuxe,
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
  );
}