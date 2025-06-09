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
import { useAppleStyles } from '../../../theme/theme-hooks';

const VoucherTable = ({ vouchers, loading, onEdit, onDelete }) => {
  const styles = useAppleStyles();
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
      return { bg: styles.colors?.neutral?.[50] || '#f5f5f5', color: styles.colors?.neutral?.[500] || '#757575' };
    }
    if (startDate && now < startDate) {
      return { bg: styles.colors?.warning?.[50] || '#fff4e5', color: styles.colors?.warning?.main || '#ff9800' };
    }
    if (endDate && now > endDate) {
      return { bg: styles.colors?.error?.[50] || '#ffebee', color: styles.colors?.error?.main || '#ff2d55' };
    }
    return { bg: styles.colors?.success?.[50] || '#e8f5e9', color: styles.colors?.success?.main || '#4caf50' };
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
    <TableContainer component={Paper} sx={styles.components?.table?.container}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead sx={styles.components?.table?.head}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  ...styles.components?.table?.cell,
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
              <TableRow key={voucher._id} sx={styles.components?.table?.row}>
                <TableCell sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    <Tag size={14} color={styles.colors?.primary?.main || '#0071e3'} />
                    {voucher.code}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    {voucher.discountType === 'percentage' ? (
                      <Percent size={14} color={styles.colors?.primary?.main || '#0071e3'} />
                    ) : (
                      <DollarSign size={14} color={styles.colors?.primary?.main || '#0071e3'} />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(1) }}>
                    <Calendar size={14} color={styles.colors?.primary?.main || '#0071e3'} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{new Date(voucher.startDate).toLocaleDateString('vi-VN')}</span>
                      <span style={{ color: styles.colors?.neutral?.[400] || '#9e9e9e' }}>
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
                        sx={{ color: styles.colors?.error?.main || '#ff2d55' }}
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