'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  TablePagination,
} from '@mui/material';
import { useState } from 'react';
import { Edit, Trash2, Eye, Tag, ImageIcon } from 'lucide-react';
import { theme } from '../../styles/index';

const ItemTable = ({
  menuItems,
  categories,
  loading,
  onEdit,
  onDelete,
  onDeleteCategory,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSizeMenuOpen = (event, sizes) => {
    setAnchorEl(event.currentTarget);
    setSelectedSizes(sizes);
  };

  const handleSizeMenuClose = () => {
    setAnchorEl(null);
    setSelectedSizes(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const itemColumns = [
    {
      id: 'image',
      label: 'Hình ảnh',
      width: '10%',
      render: (item) => {
        if (!item) return null;
        return (
          <Box sx={theme.components.image.container}>
            <img
              src={item.image || '/placeholder.svg'}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={theme.components.image.overlay}>
              <Eye size={20} color={theme.colors.white} />
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'name',
      label: 'Tên món',
      width: '20%',
      render: (item) => {
        if (!item) return null;
        return (
          <Typography variant="body1" sx={theme.components.text.body}>
            {item.name || 'N/A'}
          </Typography>
        );
      },
    },
    {
      id: 'price',
      label: 'Giá cơ bản',
      width: '15%',
      render: (item) => {
        if (!item) return null;
        return (
          <Typography variant="body2" sx={theme.components.text.bodyEmphasis}>
            {item.price?.toLocaleString() || 'N/A'} VNĐ
          </Typography>
        );
      },
    },
    {
      id: 'categories',
      label: 'Danh mục',
      width: '20%',
      render: (item) => {
        if (!item) return null;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Array.isArray(item.categories) && item.categories.length > 0 ? (
              item.categories.map((cat, index) => (
                <Chip
                  key={index}
                  label={cat.name || 'N/A'}
                  size="small"
                  sx={theme.components.chip.category}
                  icon={<Tag size={12} />}
                />
              ))
            ) : (
              <Chip
                label="Chưa phân loại"
                size="small"
                sx={theme.components.chip.empty}
              />
            )}
          </Box>
        );
      },
    },
    {
      id: 'sizes',
      label: 'Kích cỡ',
      width: '15%',
      render: (item) => {
        if (!item) return null;
        if (!Array.isArray(item.sizes) || item.sizes.length === 0) {
          return <Chip label="Không có" size="small" sx={theme.components.chip.empty} />;
        }
        return (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => handleSizeMenuOpen(e, item.sizes)}
              sx={theme.components.button.primary}
            >
              Xem {item.sizes.length} size
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSizeMenuClose}
              PaperProps={{ sx: theme.components.menu.paper }}
            >
              {selectedSizes?.map((size, index) => (
                <MenuItem key={index} sx={theme.components.menu.item}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2" sx={theme.components.text.body}>
                      {size.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={theme.components.text.success}>
                      {size.price?.toLocaleString() || 'N/A'} VNĐ
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      },
    },
    {
      id: 'description',
      label: 'Mô tả',
      width: '15%',
      render: (item) => {
        if (!item) return null;
        return (
          <Tooltip title={item.description || 'Không có mô tả'} placement="top-start">
            <Typography
              variant="body2"
              sx={{
                ...theme.components.text.caption,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 150,
              }}
            >
              {item.description || 'Không có mô tả'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: 'actions',
      label: 'Thao tác',
      width: '10%',
      render: (item) => {
        if (!item) return null;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                sx={theme.components.button.iconButton}
              >
                <Edit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                onClick={() => onDelete(item)}
                sx={theme.components.button.dangerIconButton}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const categoryColumns = [
    {
      id: 'name',
      label: 'Tên danh mục',
      width: '40%',
      render: (category) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={theme.components.avatar.categoryIndicator} />
          <Typography variant="body1" sx={theme.components.text.body}>
            {category.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'description',
      label: 'Mô tả',
      width: '50%',
      render: (category) => (
        <Typography variant="body2" sx={theme.components.text.caption}>
          {category.description || 'Không có mô tả'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Thao tác',
      width: '10%',
      render: (category) => (
        <Tooltip title="Xóa danh mục">
          <IconButton
            size="small"
            onClick={() => onDeleteCategory(category)}
            sx={theme.components.button.dangerIconButton}
          >
            <Trash2 size={16} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const paginatedMenuItems = menuItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Card sx={theme.components.card.main}>
        <Box
          sx={{
            ...theme.components.card.header,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: theme.borderRadius.sm }}>
            <ImageIcon size={20} color={theme.colors.white} />
          </Box>
          <Typography variant="h6" sx={theme.components.text.heading}>
            Danh sách món ăn
          </Typography>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={theme.components.table.container}>
            <Table>
              <TableHead
                sx={{
                  ...theme.components.table.head,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: theme.colors.white,
                }}
              >
                <TableRow>
                  {itemColumns.map((column) => (
                    <TableCell key={column.id} sx={{ width: column.width, ...theme.components.table.cell }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMenuItems.length > 0 ? (
                  paginatedMenuItems
                    .filter((item) => item && item._id)
                    .map((item) => (
                      <TableRow key={item._id} sx={theme.components.table.row}>
                        {itemColumns.map((column) => (
                          <TableCell key={column.id} sx={{ py: 2, ...theme.components.table.cell }}>
                            {column.render(item)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={itemColumns.length} align="center" sx={theme.components.table.empty}>
                      <Typography variant="body1" sx={theme.components.text.body}>
                        {loading ? 'Đang tải...' : 'Không có món ăn nào'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={menuItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
            sx={theme.components.chip.pagination}
          />
        </CardContent>
      </Card>

      <Card sx={theme.components.card.main}>
        <Box
          sx={{
            ...theme.components.card.header,
            background: theme.gradients.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: theme.borderRadius.sm }}>
            <Tag size={20} color={theme.colors.white} />
          </Box>
          <Typography variant="h6" sx={theme.components.text.heading}>
            Danh sách danh mục
          </Typography>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={theme.components.table.container}>
            <Table>
              <TableHead
                sx={{
                  ...theme.components.table.head,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: theme.colors.secondary[50],
                }}
              >
                <TableRow>
                  {categoryColumns.map((column) => (
                    <TableCell key={column.id} sx={{ width: column.width, ...theme.components.table.cell }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.filter((cat) => cat && cat._id).length > 0 ? (
                  categories
                    .filter((cat) => cat && cat._id)
                    .map((category) => (
                      <TableRow key={category._id} sx={theme.components.table.row}>
                        {categoryColumns.map((column) => (
                          <TableCell key={column.id} sx={{ py: 2, ...theme.components.table.cell }}>
                            {column.render(category)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={categoryColumns.length} align="center" sx={theme.components.table.empty}>
                      <Typography variant="body1" sx={theme.components.text.body}>
                        Không có danh mục nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ItemTable;