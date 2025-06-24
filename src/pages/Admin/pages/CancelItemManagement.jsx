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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CancelItemManagementViewModel from "./CancelItemManagementViewModel";
import { useAppleStyles } from "../../../theme/theme-hooks";

export default function CancelItemManagementView() {
  const styles = useAppleStyles();
  const {
    canceledItems,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingItem,
    formData,
    setFormData,
    page,
    setPage,
    pageSize,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    paginatedItems,
    totalPages,
    uniqueItems,
    uniqueOrders,
    uniqueUsers,
    fetchCanceledItems,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleExportToExcel,
  } = CancelItemManagementViewModel();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{ p: styles.spacing(3), bgcolor: styles.colors.background.default }}
      >
        {/* Header */}
        <Box sx={styles.header("primary")}>
          <Box sx={styles.iconContainer("glass")}>
            <CancelIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: styles.typography.fontWeight.bold,
                mb: styles.spacing(0.5),
              }}
            >
              Quản Lý Hủy Món Hàng
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Theo dõi và quản lý các món hàng đã bị hủy
            </Typography>
          </Box>
        </Box>

        {/* Filters and Search */}
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Grid container spacing={styles.spacing(3)} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên món hoặc lý do hủy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm({ value: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        sx={{
                          color: styles.colors.text.secondary,
                          mr: styles.spacing(1),
                        }}
                      />
                    ),
                  }}
                  sx={styles.input("default")}
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
                      ...styles.input("default"), // Giữ nguyên style mặc định
                      border: `2px solid ${styles.borderRadius["0"]}`, // Ghi đè viền
                      height: "58px", // Ghi đè chiều cao
                      "& .MuiSelect-select": {
                        padding: "12px 16px", // Điều chỉnh padding bên trong để phù hợp với chiều cao
                      },
                    }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="recent">Gần đây</MenuItem>
                    <MenuItem value="old">Cũ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", gap: styles.spacing(1) }}>
                  <IconButton
                    sx={styles.button("primary")}
                    onClick={fetchCanceledItems}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <IconButton
                    sx={styles.button("secondary")}
                    onClick={handleExportToExcel}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card sx={styles.card("main")}>
          <TableContainer sx={styles.components.table.container}>
            <Table>
              <TableHead sx={styles.components.table.header}>
                <TableRow>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Tên Món</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số Lượng</TableCell>
                  <TableCell>Đơn Hàng</TableCell>
                  <TableCell>Kích Thước</TableCell>
                  <TableCell>Lý Do Hủy</TableCell>
                  <TableCell>Người Hủy</TableCell>
                  <TableCell>Thời Gian</TableCell>
                  <TableCell align="center">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      sx={{ textAlign: "center", py: styles.spacing(4) }}
                    >
                      <CircularProgress
                        size={40}
                        sx={{ color: styles.colors.primary.main }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          mt: styles.spacing(2),
                          color: styles.colors.text.secondary,
                        }}
                      >
                        Đang tải dữ liệu...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      sx={{ textAlign: "center", py: styles.spacing(4) }}
                    >
                      <Typography
                        variant="body2"
                        color={styles.colors.text.secondary}
                      >
                        Không có dữ liệu
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item._id} sx={styles.components.table.row}>
                      <TableCell>
                        <Avatar
                          src={item.item_id?.image}
                          alt={item.item_id?.name}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: styles.borderRadius.sm,
                            boxShadow: styles.shadows.sm,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: styles.typography.fontWeight.semibold,
                          }}
                        >
                          {item.item_id?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: styles.colors.success,
                            fontWeight: styles.typography.fontWeight.semibold,
                          }}
                        >
                          {item.item_id?.price?.toLocaleString() || 0} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.quantity}
                          size="small"
                          sx={{
                            bgcolor: styles.colors.primary[50],
                            color: styles.colors.primary.main,
                            fontWeight: styles.typography.fontWeight.semibold,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: styles.typography.fontFamily.mono }}
                        >
                          {item.order_id?._id?.slice(-8) || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.size || "Không có"}
                        </Typography>
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
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: styles.typography.fontWeight.medium,
                          }}
                        >
                          {item.canceled_by?.name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: styles.colors.text.secondary }}
                        >
                          {dayjs(item.canceled_at).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: styles.spacing(1),
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(item)}
                            sx={{
                              bgcolor: styles.colors.primary[50],
                              color: styles.colors.primary.main,
                              "&:hover": {
                                bgcolor: styles.colors.primary[100],
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
                              bgcolor: styles.colors.error[50],
                              color: styles.colors.error,
                              "&:hover": {
                                bgcolor: styles.colors.error[100],
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: styles.spacing(3),
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: styles.borderRadius.sm,
                    fontWeight: styles.typography.fontWeight.semibold,
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
          PaperProps={{ sx: styles.components.modal.content }}
        >
          <DialogTitle sx={styles.components.modal.header}>
            Sửa Bản Ghi Hủy
          </DialogTitle>
          <DialogContent sx={{ p: styles.spacing(3), mt: styles.spacing(2) }}>
            <Grid container spacing={styles.spacing(3)}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Món hàng</InputLabel>
                  <Select
                    value={formData.item_id}
                    label="Món hàng"
                    onChange={(e) =>
                      setFormData({ ...formData, item_id: e.target.value })
                    }
                    sx={styles.input("default")}
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  inputProps={{ min: 1 }}
                  sx={styles.input("default")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mã đơn hàng</InputLabel>
                  <Select
                    value={formData.order_id}
                    label="Mã đơn hàng"
                    onChange={(e) =>
                      setFormData({ ...formData, order_id: e.target.value })
                    }
                    sx={styles.input("default")}
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
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  sx={styles.input("default")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  sx={styles.input("default")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lý do hủy"
                  value={formData.cancel_reason}
                  onChange={(e) =>
                    setFormData({ ...formData, cancel_reason: e.target.value })
                  }
                  sx={styles.input("default")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Người hủy</InputLabel>
                  <Select
                    value={formData.canceled_by}
                    label="Người hủy"
                    onChange={(e) =>
                      setFormData({ ...formData, canceled_by: e.target.value })
                    }
                    sx={styles.input("default")}
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
                  onChange={(newValue) =>
                    setFormData({ ...formData, canceled_at: newValue })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={styles.input("default")}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: styles.spacing(3), gap: styles.spacing(2) }}>
            <Button
              onClick={() => setIsModalVisible(false)}
              sx={styles.button("outline")}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} sx={styles.button("primary")}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
