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
} from "@mui/material";
import { useState } from "react";
import { Edit, Trash2, Eye, Tag, ImageIcon } from "lucide-react";
import {
  cardStyles,
  buttonStyles,
  imageStyles,
  chipStyles,
  tableStyles,
  menuStyles,
  avatarStyles,
  typography,
  colors,
} from "../../styles";

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
      id: "image",
      label: "Hình ảnh",
      width: "10%",
      render: (item) => {
        if (!item) return null;
        return (
          item.image ? (
            <Box style={imageStyles.container}>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box style={imageStyles.overlay}>
                <Eye size={20} color="#ffffff" />
              </Box>
            </Box>
          ) : (
            <Box style={imageStyles.placeholder}>
              <ImageIcon size={24} color={colors.neutral[400]} />
            </Box>
          )
        );
      },
    },
    {
      id: "name",
      label: "Tên món",
      width: "20%",
      render: (item) => {
        if (!item) return null;
        return <Typography style={typography.body1}>{item.name || "N/A"}</Typography>;
      },
    },
    {
      id: "price",
      label: "Giá cơ bản",
      width: "15%",
      render: (item) => {
        if (!item) return null;
        return (
          <Box
            style={{
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              background: colors.neutral[200],
              border: `1px solid ${colors.success.main}33`,
            }}
          >
            <Typography
              style={{ ...typography.body2, color: colors.neutral[800] }}
            >
              {item.price?.toLocaleString() || "N/A"} VNĐ
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "categories",
      label: "Danh mục",
      width: "20%",
      render: (item) => {
        if (!item) return null;
        return (
          <Box style={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.isArray(item.categories) && item.categories.length > 0 ? (
              item.categories.map((cat, index) => (
                <Chip
                  key={index}
                  label={cat.name || "N/A"}
                  style={chipStyles.category}
                  size="small"
                  icon={<Tag size={12} />}
                />
              ))
            ) : (
              <Chip
                label="Chưa phân loại"
                style={chipStyles.empty}
                size="small"
              />
            )}
          </Box>
        );
      },
    },
    {
      id: "sizes",
      label: "Kích cỡ",
      width: "15%",
      render: (item) => {
        if (!item) return null;
        if (!Array.isArray(item.sizes) || item.sizes.length === 0) {
          return (
            <Chip label="Không có" style={chipStyles.empty} size="small" />
          );
        }
        return (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => handleSizeMenuOpen(e, item.sizes)}
              style={buttonStyles.primary}
            >
              Xem {item.sizes.length} size
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSizeMenuClose}
              PaperProps={{ style: menuStyles.paper }}
            >
              {selectedSizes?.map((size, index) => (
                <MenuItem key={index} style={menuStyles.item}>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography
                      style={{
                        ...typography.body2,
                        color: colors.neutral[800],
                      }}
                    >
                      {size.name || "N/A"}
                    </Typography>
                    <Typography
                      style={{
                        ...typography.body2,
                        color: colors.success.main,
                        ml: 2,
                      }}
                    >
                      {size.price?.toLocaleString() || "N/A"} VNĐ
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
      id: "description",
      label: "Mô tả",
      width: "15%",
      render: (item) => {
        if (!item) return null;
        return (
          <Tooltip
            title={item.description || "Không có mô tả"}
            placement="top-start"
          >
            <Typography
              style={{
                ...typography.body2,
                color: colors.neutral[400],
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 150,
              }}
            >
              {item.description || "Không có mô tả"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item) => {
        if (!item) return null;
        return (
          <Box style={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                style={buttonStyles.iconButton}
              >
                <Edit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                onClick={() => onDelete(item)}
                style={buttonStyles.dangerIconButton}
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
      id: "name",
      label: "Tên danh mục",
      width: "40%",
      render: (category) => (
        <Box style={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box style={avatarStyles.categoryIndicator} />
          <Typography style={typography.body1}>{category.name}</Typography>
        </Box>
      ),
    },
    {
      id: "description",
      label: "Mô tả",
      width: "50%",
      render: (category) => (
        <Typography style={{ ...typography.body2, color: colors.neutral[400] }}>
          {category.description || "Không có mô tả"}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "Thao tác",
      width: "10%",
      render: (category) => (
        <Tooltip title="Xóa danh mục">
          <IconButton
            size="small"
            onClick={() => onDeleteCategory(category)}
            style={buttonStyles.dangerIconButton}
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
    <Box style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card style={cardStyles.main}>
        <Box style={cardStyles.headerBlue}>
          <Box style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box style={cardStyles.headerIcon}>
              <ImageIcon size={20} color="#ffffff" />
            </Box>
            <Typography style={{ ...typography.h6, color: "#ffffff" }}>
              Danh sách món ăn
            </Typography>
          </Box>
        </Box>
        <CardContent style={{ p: 0 }}>
          <TableContainer style={tableStyles.container}>
            <Table>
              <TableHead style={tableStyles.head}>
                <TableRow>
                  {itemColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ ...tableStyles.cell, width: column.width }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMenuItems.length > 0 ? (
                  paginatedMenuItems
                    .filter((item) => item && item._id) // Lọc mục hợp lệ
                    .map((item) => (
                      <TableRow key={item._id} style={tableStyles.row}>
                        {itemColumns.map((column) => (
                          <TableCell key={column.id} style={{ py: 2 }}>
                            {column.render(item)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={itemColumns.length}
                      style={tableStyles.empty}
                    >
                      <Typography style={typography.body1}>
                        {loading ? "Đang tải..." : "Không có món ăn nào"}
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
            style={tableStyles.pagination}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} của ${count}`
            }
          />
        </CardContent>
      </Card>

      <Card style={cardStyles.main}>
        <Box style={cardStyles.headerPink}>
          <Box style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box style={cardStyles.headerIcon}>
              <Tag size={20} color="#ffffff" />
            </Box>
            <Typography style={{ ...typography.h6, color: "#ffffff" }}>
              Danh sách danh mục
            </Typography>
          </Box>
        </Box>
        <CardContent style={{ p: 0 }}>
          <TableContainer style={tableStyles.container}>
            <Table>
              <TableHead
                style={{
                  ...tableStyles.head,
                  ...tableStyles.head["&.category"],
                }}
              >
                <TableRow>
                  {categoryColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ ...tableStyles.cell, width: column.width }}
                    >
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
                      <TableRow
                        key={category._id}
                        style={{
                          ...tableStyles.row,
                          ...tableStyles.row["&.category"],
                        }}
                      >
                        {categoryColumns.map((column) => (
                          <TableCell key={column.id} style={{ py: 2 }}>
                            {column.render(category)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={categoryColumns.length}
                      style={tableStyles.empty}
                    >
                      <Typography style={typography.body1}>
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