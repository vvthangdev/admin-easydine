'use client';

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
import { useTheme } from '@mui/material/styles';

const UserSearch = ({ onSelectCustomer }) => {
  const theme = useTheme();
  console.log('Theme structure:', theme); // Debug theme
  console.log('Components:', theme.components); // Sửa: không dùng spread
  console.log('Text:', theme.components.text); // Sửa: không dùng spread
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

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography
        variant="h6"
        sx={{
          ...theme.components.text.heading, // Sửa: thêm spread operator
          mb: theme.spacing(4),
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
          mb: theme.spacing(4),
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color={theme.colors?.primary?.main || theme.palette.primary.main} />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress
                size={20}
                sx={{
                  color: theme.colors?.primary?.second || theme.palette.primary.main,
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
            ...theme.components.table.container,
            background: theme.components.card.main.background,
            boxShadow: theme.shadows.sm, // Sửa: sử dụng shadow từ theme
          }}
        >
          <Table size="small">
            <TableHead sx={theme.components.table.head}>
              <TableRow>
                <TableCell
                  sx={{
                    ...theme.components.table.cell,
                    fontWeight: theme.typography.fontWeight?.semibold || 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <User size={16} />
                    Tên
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...theme.components.table.cell,
                    fontWeight: theme.typography.fontWeight?.semibold || 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <Phone size={16} />
                    Số điện thoại
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...theme.components.table.cell,
                    fontWeight: theme.typography.fontWeight?.semibold || 600,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <Home size={16} />
                    Địa chỉ
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...theme.components.table.cell,
                    fontWeight: theme.typography.fontWeight?.semibold || 600,
                  }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((record) => (
                <TableRow
                  key={record._id}
                  sx={{
                    ...theme.components.table.row,
                    '&:hover': {
                      backgroundColor:
                        theme.colors?.primary?.[50] || theme.palette.primary.light || '#e6f3ff',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      ...theme.components.table.cell,
                      color: theme.colors?.neutral?.[900] || theme.palette.text.primary,
                    }}
                  >
                    {record.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...theme.components.table.cell,
                      color: theme.colors?.neutral?.[900] || theme.palette.text.primary,
                    }}
                  >
                    {record.phone}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...theme.components.table.cell,
                      color: theme.colors?.neutral?.[900] || theme.palette.text.primary,
                    }}
                  >
                    {record.address}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleSelectCustomer(record)}
                      sx={{
                        ...theme.components.button.primary,
                        px: theme.spacing(2),
                        py: theme.spacing(0.5),
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