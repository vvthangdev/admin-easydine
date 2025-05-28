import React, { useState } from 'react';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { userAPI } from '../../services/apis/User';

const UserSearch = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await userAPI.searchUsers(query);
      setSearchResults(response);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const handleSelectCustomer = (customer) => {
    setSearchTerm('');
    setSearchResults([]);
    onSelectCustomer(customer);
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tìm kiếm khách hàng
      </Typography>
      <TextField
        fullWidth
        label="Tìm kiếm theo tên, số điện thoại, địa chỉ"
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      {searchResults.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell>{record.address}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleSelectCustomer(record)}
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