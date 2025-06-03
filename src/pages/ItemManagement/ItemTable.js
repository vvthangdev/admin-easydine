"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Avatar,
} from "@mui/material"
import { useState } from "react"
import { Edit, Trash2, Eye, Tag, ImageIcon, MoreVertical } from 'lucide-react'

const ItemTable = ({ menuItems, categories, loading, onEdit, onDelete, onDeleteCategory }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedSizes, setSelectedSizes] = useState(null)

  const handleSizeMenuOpen = (event, sizes) => {
    setAnchorEl(event.currentTarget)
    setSelectedSizes(sizes)
  }

  const handleSizeMenuClose = () => {
    setAnchorEl(null)
    setSelectedSizes(null)
  }

  const itemColumns = [
    {
      id: "image",
      label: "Hình ảnh",
      width: "10%",
      render: (item) =>
        item.image ? (
          <Box
            sx={{
              position: "relative",
              width: 64,
              height: 64,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.2)",
                  opacity: 1,
                },
              }}
            >
              <Eye size={20} color="#ffffff" />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: "linear-gradient(145deg, #f5f5f7 0%, #e5e5ea 100%)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon size={24} color="#86868b" />
          </Box>
        ),
    },
    {
      id: "name",
      label: "Tên món",
      width: "20%",
      render: (item) => (
        <Typography
          variant="body1"
          sx={{
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
          }}
        >
          {item.name}
        </Typography>
      ),
    },
    {
      id: "price",
      label: "Giá cơ bản",
      width: "15%",
      render: (item) => (
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            background: "linear-gradient(145deg, rgba(52, 199, 89, 0.1) 0%, rgba(52, 199, 89, 0.05) 100%)",
            border: "1px solid rgba(52, 199, 89, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#34c759",
              fontWeight: 600,
            }}
          >
            {item.price?.toLocaleString()} VNĐ
          </Typography>
        </Box>
      ),
    },
    {
      id: "categories",
      label: "Danh mục",
      width: "20%",
      render: (item) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {Array.isArray(item.categories) && item.categories.length > 0 ? (
            item.categories.map((cat, index) => (
              <Chip
                key={index}
                label={cat.name}
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(156, 39, 176, 0.1)",
                  color: "#9c27b0",
                  fontWeight: 500,
                  borderRadius: 2,
                  "& .MuiChip-label": { px: 1 },
                }}
                size="small"
                icon={<Tag size={12} />}
              />
            ))
          ) : (
            <Chip
              label="Chưa phân loại"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor: "rgba(142, 142, 147, 0.1)",
                color: "#8e8e93",
                fontWeight: 500,
                borderRadius: 2,
              }}
              size="small"
            />
          )}
        </Box>
      ),
    },
    {
      id: "sizes",
      label: "Kích cỡ",
      width: "15%",
      render: (item) => {
        if (!Array.isArray(item.sizes) || item.sizes.length === 0) {
          return (
            <Chip
              label="Không có"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor: "rgba(142, 142, 147, 0.1)",
                color: "#8e8e93",
                fontWeight: 500,
                borderRadius: 2,
              }}
              size="small"
            />
          )
        }

        return (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => handleSizeMenuOpen(e, item.sizes)}
              sx={{
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                color: "#ffffff",
                borderRadius: 28,
                px: 2,
                boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                  boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Xem {item.sizes.length} size
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSizeMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                },
              }}
            >
              {selectedSizes?.map((size, index) => (
                <MenuItem
                  key={index}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 113, 227, 0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", minWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1d1d1f" }}>
                      {size.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#34c759", fontWeight: 600, ml: 2 }}>
                      {size.price?.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        )
      },
    },
    {
      id: "description",
      label: "Mô tả",
      width: "15%",
      render: (item) => (
        <Tooltip title={item.description || "Không có mô tả"} placement="topLeft">
          <Typography
            variant="body2"
            sx={{
              color: "#86868b",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {item.description || "Không có mô tả"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={() => onEdit(item)}
              sx={{
                color: "#0071e3",
                "&:hover": {
                  backgroundColor: "rgba(0, 113, 227, 0.1)",
                },
              }}
            >
              <Edit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={() => onDelete(item)}
              sx={{
                color: "#ff3b30",
                "&:hover": {
                  backgroundColor: "rgba(255, 59, 48, 0.1)",
                },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const categoryColumns = [
    {
      id: "name",
      label: "Tên danh mục",
      width: "40%",
      render: (category) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #9c27b0 0%, #673ab7 100%)",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: "#1d1d1f",
              fontWeight: 600,
              fontFamily: '"SF Pro Display", Roboto, sans-serif',
            }}
          >
            {category.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: "description",
      label: "Mô tả",
      width: "50%",
      render: (category) => (
        <Typography variant="body2" sx={{ color: "#86868b" }}>
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
            sx={{
              color: "#ff3b30",
              "&:hover": {
                backgroundColor: "rgba(255, 59, 48, 0.1)",
              },
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Menu Items Table */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={20} color="#ffffff" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: 600,
                fontFamily: '"SF Pro Display", Roboto, sans-serif',
              }}
            >
              Danh sách món ăn
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 113, 227, 0.05)" }}>
                  {itemColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        width: column.width,
                        fontWeight: 600,
                        color: "#1d1d1f",
                        py: 2,
                        fontSize: "0.875rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      {itemColumns.map((column) => (
                        <TableCell key={column.id} sx={{ py: 2 }}>
                          {column.render(item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={itemColumns.length} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" sx={{ color: "#86868b" }}>
                        {loading ? "Đang tải..." : "Không có món ăn nào"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(145deg, #f093fb 0%, #f5576c 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tag size={20} color="#ffffff" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: 600,
                fontFamily: '"SF Pro Display", Roboto, sans-serif',
              }}
            >
              Danh sách danh mục
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(156, 39, 176, 0.05)" }}>
                  {categoryColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        width: column.width,
                        fontWeight: 600,
                        color: "#1d1d1f",
                        py: 2,
                        fontSize: "0.875rem",
                      }}
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
                        sx={{
                          "&:hover": { backgroundColor: "rgba(156, 39, 176, 0.05)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        {categoryColumns.map((column) => (
                          <TableCell key={column.id} sx={{ py: 2 }}>
                            {column.render(category)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={categoryColumns.length} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" sx={{ color: "#86868b" }}>
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
  )
}

export default ItemTable
