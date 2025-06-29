import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search, User, Phone, Home } from 'lucide-react';
import debounce from 'lodash.debounce';
import { userAPI } from '../../services/apis/User';
import { useAppleStyles } from '../../theme/theme-hooks'; // Import Apple styles

const UserSearch = ({ onSelectCustomer }) => {
  const styles = useAppleStyles();
  console.log('Apple styles:', styles); // Debug Apple styles
  console.log('Components:', styles.components); // Debug components
  console.log('Text:', styles.components?.text); // Debug text styles
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.searchUsers(query);
      setSearchResults(response);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce((value) => searchUsers(value), 300), []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSelectCustomer = (customer) => {
    setSearchTerm('');
    setSearchResults([]);
    onSelectCustomer(customer);
  };

  // Fallback colors
  const primaryColor = styles.colors?.primary?.main ;
  const primaryLight = styles.colors?.primary?.[50] ;
  const textPrimary = styles.colors?.text?.primary ;
  const textSecondary = styles.colors?.text?.secondary ;
  const neutral900 = styles.colors?.neutral?.[900] ;

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography
        variant="h6"
        sx={{
          ...styles.components?.text?.heading,
          mb: styles.spacing(4),
        }}
      >
        Tìm kiếm khách hàng
      </Typography>
      <TextField
        fullWidth
        label="Tìm kiếm theo tên, số điện thoại, địa chỉ"
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
        sx={{
          mb: styles.spacing(4),
          ...styles.input("default"), // Áp dụng style input từ Apple theme
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color={primaryColor} />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress
                size={20}
                sx={{
                  color: primaryColor,
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {searchResults.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            ...styles.components?.table?.container,
            background: styles.components?.card?.main?.background || '#ffffff',
            boxShadow: styles.shadows?.sm,
          }}
        >
          <Table size="small">
            <TableHead sx={styles.components?.table?.head}>
              <TableRow>
                <TableCell
                  sx={{
                    ...styles.components?.table?.cell,
                    fontWeight: 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    <User size={16} />
                    Tên
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.components?.table?.cell,
                    fontWeight: 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    <Phone size={16} />
                    Số điện thoại
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.components?.table?.cell,
                    fontWeight: 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    <Home size={16} />
                    Địa chỉ
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.components?.table?.cell,
                    fontWeight: 600,
                  }}
                >
                  
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((record) => (
                <TableRow
                  key={record._id}
                  sx={{
                    ...styles.components?.table?.row,
                    '&:hover': {
                      backgroundColor: primaryLight,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      ...styles.components?.table?.cell,
                      color: neutral900,
                    }}
                  >
                    {record.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles.components?.table?.cell,
                      color: neutral900,
                    }}
                  >
                    {record.phone}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles.components?.table?.cell,
                      color: neutral900,
                    }}
                  >
                    {record.address}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleSelectCustomer(record)}
                      sx={{
                        ...styles.button("primary"), // Sử dụng button primary từ Apple theme
                        px: styles.spacing(2),
                        py: styles.spacing(0.5),
                        minWidth: 0,
                      }}
                    >
                      Chọn
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserSearch;