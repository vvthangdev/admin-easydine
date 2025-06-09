'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Trash2, Percent, Calendar, Tag, DollarSign } from 'lucide-react';
import { theme } from '../../../styles'; // Chỉ import theme cho colors

const VoucherTable = ({ vouchers, loading, onEdit, onDelete }) => {
  const columns = [
    { id: 'code', label: 'Mã', width: '15%' },
    { id: 'discount', label: 'Giảm giá', width: '15%' },
    { id: 'discountType', label: 'Loại', width: '10%', hideOnMobile: true },
    { id: 'minOrderValue', label: 'Đơn tối thiểu', width: '15%', hideOnMobile: true },
    { id: 'dates', label: 'Thời gian', width: '25%' },
    { id: 'status', label: 'Trạng thái', width: '10%' },
    { id: 'action', label: 'Thao tác', width: '10%' },
  ];

  const getStatusColor = (voucher) => {
    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

    if (!voucher.isActive) {
      return { bg: theme.colors.neutral[50], color: theme.colors.neutral[500] };
    }
    if (startDate && now < startDate) {
      return { bg: theme.colors.warning[50], color: theme.colors.warning.main };
    }
    if (endDate && now > endDate) {
      return { bg: theme.colors.error[50], color: theme.colors.error.main };
    }
    return { bg: theme.colors.success[50], color: theme.colors.success.main };
  };

  const getStatusLabel = (voucher) => {
    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

    if (!voucher.isActive) {
      return 'Không kích hoạt';
    }
    if (startDate && now < startDate) {
      return 'Chưa bắt đầu';
    }
    if (endDate && now > endDate) {
      return 'Hết hạn';
    }
    return 'Đang hoạt động';
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  width: column.width,
                  display: column.hideOnMobile ? { xs: 'none', md: 'table-cell' } : 'table-cell',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(vouchers) && vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tag size={14} color={theme.colors.primary.main} />
                    {voucher.code}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {voucher.discountType === 'percentage' ? (
                      <Percent size={14} color={theme.colors.primary.main} />
                    ) : (
                      <DollarSign size={14} color={theme.colors.primary.main} />
                    )}
                    <span>
                      {voucher.discount}
                      {voucher.discountType === 'percentage' ? '%' : ' VNĐ'}
                    </span>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {voucher.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {voucher.minOrderValue.toLocaleString()} VNĐ
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} color={theme.colors.primary.main} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{new Date(voucher.startDate).toLocaleDateString('vi-VN')}</span>
                      <span style={{ color: theme.colors.neutral[400] }}>
                        → {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(voucher)}
                    sx={{
                      backgroundColor: getStatusColor(voucher).bg,
                      color: getStatusColor(voucher).color,
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Sửa">
                      <IconButton size="small" onClick={() => onEdit(voucher)}>
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(voucher)}
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {loading ? 'Đang tải...' : 'Không có dữ liệu'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VoucherTable;