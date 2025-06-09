"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Pagination,
  CircularProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { toast } from "react-toastify"
import { canceledItemOrderAPI } from "../../../services/apis/CanceledItemOrderAPI"

export default function CancelItemManagement() {
  const [canceledItems, setCanceledItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    item_id: "",
    quantity: 1,
    order_id: "",
    size: "",
    note: "",
    cancel_reason: "",
    canceled_by: "",
    canceled_at: dayjs(),
  })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Lấy danh sách bản ghi hủy món hàng
  const fetchCanceledItems = async () => {
    setLoading(true)
    try {
      const response = await canceledItemOrderAPI.getAllCanceledItemOrders()
      setCanceledItems(response || [])
      console.log("Danh sách bản ghi hủy:", response)
    } catch (error) {
      toast.error("Lỗi khi tải danh sách bản ghi hủy")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCanceledItems()
  }, [])

  // Xử lý thêm bản ghi
  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      item_id: "",
      quantity: 1,
      order_id: "",
      size: "",
      note: "",
      cancel_reason: "",
      canceled_by: "",
      canceled_at: dayjs(),
    })
    setIsModalVisible(true)
  }

  // Xử lý sửa bản ghi
  const handleEdit = (record) => {
    setEditingItem(record)
    setFormData({
      item_id: record.item_id._id,
      quantity: record.quantity,
      order_id: record.order_id._id,
      size: record.size || "",
      note: record.note || "",
      cancel_reason: record.cancel_reason,
      canceled_by: record.canceled_by._id,
      canceled_at: dayjs(record.canceled_at),
    })
    setIsModalVisible(true)
  }

  // Xử lý xóa bản ghi
  const handleDelete = async (id) => {
    try {
      await canceledItemOrderAPI.deleteCanceledItemOrder(id)
      setCanceledItems(canceledItems.filter((item) => item._id !== id))
      toast.success("Xóa bản ghi hủy thành công")
    } catch (error) {
      toast.error("Lỗi khi xóa bản ghi hủy")
    }
  }

  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        canceled_at: formData.canceled_at.toISOString(),
      }

      if (editingItem) {
        await canceledItemOrderAPI.updateCanceledItemOrder(editingItem._id, payload)
        setCanceledItems(canceledItems.map((item) => (item._id === editingItem._id ? { ...item, ...payload } : item)))
        toast.success("Cập nhật bản ghi hủy thành công")
      } else {
        const newItem = await canceledItemOrderAPI.createCanceledItemOrder(payload)
        setCanceledItems([...canceledItems, newItem])
        toast.success("Thêm bản ghi hủy thành công")
      }
      setIsModalVisible(false)
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  // Lọc và phân trang dữ liệu
  const filteredItems = canceledItems.filter((item) => {
    const matchesSearch =
      item.item_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cancel_reason?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredItems.length / pageSize)

  // Lấy danh sách duy nhất cho Select
  const uniqueItems = Array.from(
    new Map(canceledItems.map((item) => [item.item_id?._id, item.item_id])).values(),
  ).filter(Boolean)
  const uniqueOrders = Array.from(
    new Map(canceledItems.map((item) => [item.order_id?._id, item.order_id])).values(),
  ).filter(Boolean)
  const uniqueUsers = Array.from(
    new Map(canceledItems.map((item) => [item.canceled_by?._id, item.canceled_by])).values(),
  ).filter(Boolean)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            p: 3,
            background: "linear-gradient(135deg, #ff2d55 0%, #e6294d 100%)",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 8px 32px rgba(255, 45, 85, 0.3)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CancelIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                mb: 0.5,
              }}
            >
              Quản Lý Hủy Món Hàng
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Theo dõi và quản lý các món hàng đã bị hủy
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "28px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Thêm Bản Ghi
          </Button>
        </Box>

        {/* Filters and Search */}
        <Card
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên món hoặc lý do hủy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "28px",
                      backgroundColor: "#f8fafc",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Lọc theo trạng thái</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Lọc theo trạng thái"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      borderRadius: "28px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="recent">Gần đây</MenuItem>
                    <MenuItem value="old">Cũ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={fetchCanceledItems}
                    sx={{
                      background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
                      color: "white",
                      borderRadius: "12px",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0, 113, 227, 0.3)",
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      background: "linear-gradient(135deg, #34c759 0%, #28a745 100%)",
                      color: "white",
                      borderRadius: "12px",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(52, 199, 89, 0.3)",
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Ảnh</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Tên Món</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Giá</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Số Lượng</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Đơn Hàng</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Kích Thước</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Lý Do Hủy</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Người Hủy</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>Thời Gian</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1e293b", textAlign: "center" }}>Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                        Đang tải dữ liệu...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                          transform: "scale(1.001)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={item.item_id?.image}
                          alt={item.item_id?.name}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.item_id?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#059669", fontWeight: 600 }}>
                          {item.item_id?.price?.toLocaleString() || 0} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.quantity}
                          size="small"
                          sx={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {item.order_id?._id?.slice(-8) || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.size || "Không có"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.cancel_reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.canceled_by?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {dayjs(item.canceled_at).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{
                              backgroundColor: "#dbeafe",
                              color: "#1e40af",
                              "&:hover": {
                                backgroundColor: "#bfdbfe",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item._id)}
                            sx={{
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              "&:hover": {
                                backgroundColor: "#fecaca",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          )}
        </Card>

        {/* Modal */}
        <Dialog
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
              color: "white",
              fontWeight: 700,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {editingItem ? "Sửa Bản Ghi Hủy" : "Thêm Bản Ghi Hủy Mới"}
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Món hàng</InputLabel>
                  <Select
                    value={formData.item_id}
                    label="Món hàng"
                    onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                    sx={{ borderRadius: "12px" }}
                  >
                    {uniqueItems.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name} ({item.price?.toLocaleString()} VNĐ)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mã đơn hàng</InputLabel>
                  <Select
                    value={formData.order_id}
                    label="Mã đơn hàng"
                    onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                    sx={{ borderRadius: "12px" }}
                  >
                    {uniqueOrders.map((order) => (
                      <MenuItem key={order._id} value={order._id}>
                        {order._id} ({order.final_amount?.toLocaleString()} VNĐ)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kích thước"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lý do hủy"
                  value={formData.cancel_reason}
                  onChange={(e) => setFormData({ ...formData, cancel_reason: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Người hủy</InputLabel>
                  <Select
                    value={formData.canceled_by}
                    label="Người hủy"
                    onChange={(e) => setFormData({ ...formData, canceled_by: e.target.value })}
                    sx={{ borderRadius: "12px" }}
                  >
                    {uniqueUsers.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.username})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Thời gian hủy"
                  value={formData.canceled_at}
                  onChange={(newValue) => setFormData({ ...formData, canceled_at: newValue })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setIsModalVisible(false)}
              sx={{
                borderRadius: "28px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
                borderRadius: "28px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 113, 227, 0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(0, 113, 227, 0.4)",
                },
              }}
            >
              {editingItem ? "Cập Nhật" : "Thêm Mới"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  )
}
