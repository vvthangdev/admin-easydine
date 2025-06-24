import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Edit, Trash2, User, Calendar, Eye } from 'lucide-react';
import moment from 'moment';
import { useAppleStyles } from '../../theme/theme-hooks';

const OrderTable = ({
  orders,
  loading,
  onStatusChange,
  onViewCustomerDetails,
  onViewDetails,
  onEdit,
  onDelete,
  handleCopyOrderId,
}) => {
  const styles = useAppleStyles();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: styles.colors.backgroundStatus.warning.light , color: styles.colors.warning};
      case 'confirmed':
        return { bg: styles.colors.white , color: styles.colors?.success };
      case 'completed':
        return { bg: styles.colors.backgroundStatus.success.light, color: styles.colors?.secondary.main };
      case 'canceled':
        return { bg: styles.colors.backgroundStatus.error.light, color: styles.colors.error };
      default:
        return { bg: styles.colors?.white, color: styles.colors?.black };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'reservation':
        return 'Đặt bàn';
      case 'takeaway':
        return 'Giao hàng';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress sx={{ color: styles.colors?.primary?.main || '#0071e3' }} />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        ...styles.components?.table?.container,
        background: styles.gradients?.light || 'linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)',
        boxShadow: styles.shadows?.sm,
        border: `1px solid ${styles.colors?.neutral?.[100] || 'rgba(0, 0, 0, 0.05)'}`,
        borderRadius: styles.rounded('lg'),
      }}
    >
      <Table stickyHeader>
        <TableHead sx={styles.components?.table?.head}>
          <TableRow>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              Mã đơn hàng
            </TableCell>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                <User size={16} />
                Khách hàng
              </Box>
            </TableCell>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                <Calendar size={16} />
                Ngày
              </Box>
            </TableCell>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              Trạng thái
            </TableCell>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              Loại đơn hàng
            </TableCell>
            <TableCell sx={{ ...styles.components?.table?.cell, fontWeight: 600, backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  ...styles.components?.table?.row,
                  '&:hover': { backgroundColor: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' },
                }}
              >
                <TableCell
                  sx={{
                    ...styles.components?.table?.cell,
                    color: styles.colors?.text?.primary || '#1d1d1f',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': { color: styles.colors?.primary?.main || '#0071e3', textDecoration: 'underline' },
                  }}
                  onClick={() => handleCopyOrderId(record.id)}
                  title={`Sao chép mã: ${record.id}`}
                >
                  #{record.id.slice(-4)}
                </TableCell>
                <TableCell>
                  <Button
                    sx={{
                      ...styles.button('ghost'),
                      color: styles.colors?.primary?.main || '#0071e3',
                      '&:hover': { background: styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.05)' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: styles.spacing(1),
                      px: styles.spacing(1),
                    }}
                    onClick={() => onViewCustomerDetails(record.customerId)}
                  >
                    <User size={16} />
                    {`${record.customerName} - ${record.customerPhone}`}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: styles.colors?.text?.primary || '#1d1d1f' }}>
                  {record.time ? moment.utc(record.time).local().format('HH:mm, DD/MM/YY') : 'N/A'}
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={record.status}
                      onChange={(e) => onStatusChange(record.id, e.target.value)}
                      sx={{
                        ...styles.input('default'),
                        height: 50,
                        backgroundColor: getStatusColor(record.status).bg,
                        color: getStatusColor(record.status).color,
                        fontWeight: 500,
                      }}
                      disabled={loading}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: styles.rounded('sm'),
                            boxShadow: styles.shadows?.md,
                          },
                        },
                      }}
                    >
                      <MenuItem value="pending" sx={{ color: getStatusColor('pending').color }}>
                        {getStatusLabel('pending')}
                      </MenuItem>
                      <MenuItem value="confirmed" sx={{ color: getStatusColor('confirmed').color }}>
                        {getStatusLabel('confirmed')}
                      </MenuItem>
                      <MenuItem value="completed" sx={{ color: getStatusColor('completed').color }}>
                        {getStatusLabel('completed')}
                      </MenuItem>
                      <MenuItem value="canceled" sx={{ color: getStatusColor('canceled').color }}>
                        {getStatusLabel('canceled')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getOrderTypeLabel(record.type)}
                    sx={{
                      bgcolor: record.type === 'reservation' ? styles.colors?.primary?.[50] || 'rgba(0, 113, 227, 0.1)' : styles.colors?.secondary?.[50] || 'rgba(156, 39, 176, 0.1)',
                      color: record.type === 'reservation' ? styles.colors?.primary?.main || '#0071e3' : styles.colors?.secondary?.main || '#9c27b0',
                      fontWeight: 500,
                      borderRadius: styles.rounded('sm'),
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: styles.spacing(1) }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Edit size={16} />}
                      onClick={() => onEdit(record)}
                      disabled={loading}
                      sx={{
                        ...styles.button('primary'),
                        borderRadius: styles.rounded('full'),
                        boxShadow: styles.shadows?.sm,
                      }}
                    >
                      Sửa
                    </Button>
                    {onViewDetails && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => onViewDetails(record.id)}
                        disabled={loading}
                        sx={{
                          ...styles.button('outline'),
                          borderRadius: styles.rounded('full'),
                          color: styles.colors?.text?.secondary || '#86868b',
                          borderColor: styles.colors?.neutral?.[200] || '#86868b',
                        }}
                      >
                        Chi tiết
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => onDelete(record)}
                      disabled={loading}
                      sx={{
                        ...styles.button('outline'),
                        borderRadius: styles.rounded('full'),
                        color: styles.colors?.error?.main || '#ff2d55',
                        borderColor: styles.colors?.error?.main || '#ff2d55',
                      }}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: styles.spacing(6) }}>
                <Typography variant="body1" sx={{ color: styles.colors?.text?.secondary || '#86868b' }}>
                  Không có đơn hàng nào
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;