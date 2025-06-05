import { memo } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { message } from 'antd';
import { userAPI } from '../../services/apis/User';
import { useAuth } from '../../contexts/AuthContext';
import colors from '../../theme/colors';

function Header({ logo, navLinks }) {
  const { user, loading: authLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchProfile = async () => {
    if (profile) return;
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

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    if (!profile) {
      fetchProfile();
    }
  }, [user, profile]);
// ...
const handleLogout = async () => {
  try {
    await logout(); // Gọi logout từ AuthContext
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
        bgcolor: colors.creamGold,
        boxShadow: `0 4px 16px rgba(0,0,0,0.1)`,
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
              border: `1px solid ${colors.goldLuxe}`,
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
                color: colors.navySapphire,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { color: colors.goldLuxe },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {authLoading || loading ? (
          <Typography variant="body2" color={colors.silverMist}>
            Đang tải...
          </Typography>
        ) : (
          <>
            {user && (
              <Button
                component={Link}
                to="/overview"
                sx={{
                  color: colors.goldLuxe,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { color: colors.rubyWine },
                }}
              >
                Dashboard
              </Button>
            )}
            {user ? (
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
                      border: `2px solid ${colors.goldLuxe}`,
                    }}
                  />
                  <Typography
                    sx={{
                      ml: 1,
                      color: colors.navySapphire,
                      fontWeight: 500,
                    }}
                  >
                    {user.username}
                  </Typography>
                  <ExpandMore
                    sx={{
                      ml: 1,
                      color: colors.silverMist,
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
                      bgcolor: colors.moonlightWhite,
                      border: `1px solid ${colors.goldLuxe}`,
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
                      '&:hover': { bgcolor: colors.creamGold },
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
                      color: colors.rubyWine,
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
                    borderColor: colors.goldLuxe,
                    color: colors.goldLuxe,
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: colors.moonlightWhite,
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
                    bgcolor: colors.goldLuxe,
                    color: colors.obsidianBlack,
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: colors.moonlightWhite,
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

export default memo(Header);