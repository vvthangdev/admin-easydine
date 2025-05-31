import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Button,
} from "@mui/material";
import OrderBasicInfoViewModel from "./OrderBasicInfoViewModel";
import PaymentModal from "./Payment/PaymentModal";
import CancelItemsModal from "./CancelItemsModal"; // Import modal mới
import { toast } from "react-toastify";

const OrderBasicInfoView = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
  editingOrder,
  orderId,
}) => {
  const {
    staffList,
    groupedTables,
    handleChange,
    handleTableChange,
    subtotal,
    total,
    applyVoucher,
  } = OrderBasicInfoViewModel({
    formData,
    setFormData,
    availableTables,
    fetchAvailableTables,
    isTableAvailable,
    orderId,
  });

  const activeTab = Object.keys(groupedTables)[0] || "Tầng 1";
  const [currentTab, setCurrentTab] = React.useState(activeTab);
  const [voucherCode, setVoucherCode] = React.useState(
    formData.voucherCode || ""
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelItemsModalOpen, setCancelItemsModalOpen] = useState(false); // Trạng thái modal hủy món

  React.useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab, groupedTables]);

  const handleApplyVoucher = () => {
    if (!voucherCode) {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }
    applyVoucher(voucherCode, orderId || editingOrder?.id);
  };

  const handleOpenPaymentModal = () => {
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handleOpenCancelItemsModal = () => {
    setCancelItemsModalOpen(true);
  };

  const handleCloseCancelItemsModal = () => {
    setCancelItemsModalOpen(false);
  };

  const handleCancelItemsSuccess = (remainingItems) => {
    // Cập nhật danh sách món ăn sau khi hủy thành công
    setFormData((prev) => ({
      ...prev,
      items: remainingItems.map((item) => ({
        id: item.item_id,
        name: item.itemName,
        price: item.itemPrice,
        quantity: item.quantity,
        size: item.size || null,
        note: item.note || "",
        itemName: item.itemName,
        itemImage: item.itemImage || "https://via.placeholder.com/80",
      })),
    }));
    setCancelItemsModalOpen(false);
    toast.success("Hủy món thành công!");
  };

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, p: 1 }}>
        Thông tin đơn hàng
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Loại đơn hàng</InputLabel>
              <Select
                name="type"
                value={formData.type || ""}
                label="Loại đơn hàng"
                onChange={handleChange}
              >
                <MenuItem value="reservation">Đặt chỗ</MenuItem>
                <MenuItem value="ship">Giao hàng</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}
            >
              <Typography variant="subtitle1">Trạng thái</Typography>
              <Typography
                sx={{
                  p: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: "grey.50",
                }}
              >
                {formData.status === "pending"
                  ? "Chờ xác nhận"
                  : formData.status === "confirmed"
                  ? "Đã xác nhận"
                  : formData.status === "completed"
                  ? "Hoàn thành"
                  : formData.status === "canceled"
                  ? "Đã hủy"
                  : "Không xác định"}
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Nhân viên phụ trách</InputLabel>
              <Select
                name="staff_id"
                value={formData.staff_id || ""}
                label="Nhân viên phụ trách"
                onChange={handleChange}
              >
                <MenuItem value="">Không chọn</MenuItem>
                {staffList.map((staff) => (
                  <MenuItem key={staff._id} value={staff._id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Ngày"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              fullWidth
              placeholder="DD/MM/YYYY"
            />

            <TextField
              label="Giờ bắt đầu"
              name="start_time"
              value={formData.start_time || ""}
              onChange={handleChange}
              fullWidth
              placeholder="HH:mm"
            />

            <TextField
              label="Giờ kết thúc"
              name="end_time"
              value={formData.end_time || ""}
              onChange={handleChange}
              fullWidth
              placeholder="HH:mm"
            />

            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Chọn bàn
              </Typography>
              {Object.keys(groupedTables).length > 0 ? (
                <>
                  <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    sx={{ mb: 1 }}
                  >
                    {Object.keys(groupedTables).map((area) => (
                      <Tab key={area} label={area} value={area} />
                    ))}
                  </Tabs>
                  {Object.keys(groupedTables).map((area) => (
                    <Box
                      key={area}
                      sx={{ display: currentTab === area ? "block" : "none" }}
                    >
                      <FormControl fullWidth>
                        <InputLabel>Chọn bàn ở {area}</InputLabel>
                        <Select
                          multiple
                          value={
                            formData.tables && groupedTables[area]
                              ? groupedTables[area]
                                  .filter((table) =>
                                    formData.tables.includes(table._id)
                                  )
                                  .map(
                                    (table) =>
                                      `${table.table_number}|${table.area}|${table._id}`
                                  )
                              : []
                          }
                          label={`Chọn bàn ở ${area}`}
                          onChange={(e) =>
                            handleTableChange(area, e.target.value)
                          }
                          renderValue={(selected) =>
                            selected.map((key) => key.split("|")[0]).join(", ")
                          }
                        >
                          {groupedTables[area]
                            .sort((a, b) => {
                              const aSelected = formData.tables.includes(a._id);
                              const bSelected = formData.tables.includes(b._id);
                              return bSelected - aSelected;
                            })
                            .map((table) => (
                              <MenuItem
                                key={table._id}
                                value={`${table.table_number}|${table.area}|${table._id}`}
                                sx={{
                                  fontWeight: formData.tables.includes(
                                    table._id
                                  )
                                    ? "bold"
                                    : "normal",
                                  color: formData.tables.includes(table._id)
                                    ? "primary.main"
                                    : "inherit",
                                }}
                              >
                                Bàn {table.table_number} (Sức chứa:{" "}
                                {table.capacity})
                                {formData.tables.includes(table._id) &&
                                  " - Đã chọn"}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography color="text.secondary">Không có bàn nào</Typography>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ p: 1, mt: { xs: 2, md: 0 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1">Danh sách món ăn</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenCancelItemsModal}
                disabled={
                  !formData.items ||
                  formData.items.length === 0 ||
                  formData.status === "pending"
                }
                sx={{ minWidth: 100 }}
              >
                Hủy Món
              </Button>
            </Box>
            <TableContainer
              sx={{
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Tên món</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Kích thước
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Giá</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tổng</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items && formData.items.length > 0 ? (
                    formData.items.map((item) => (
                      <TableRow
                        key={`${item.id}-${item.size || "default"}`}
                        sx={{ "&:hover": { bgcolor: "grey.100" } }}
                      >
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.size || "Mặc định"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toLocaleString()} VND</TableCell>
                        <TableCell>
                          {(item.price * item.quantity).toLocaleString()} VND
                        </TableCell>
                        <TableCell>{item.note || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Chưa có món ăn nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                mt: 2,
                p: 1,
                bgcolor: "grey.50",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1">Hóa đơn tạm tính</Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>Tổng tiền món (Đã bao gồm VAT):</Typography>
                <Typography fontWeight="bold">
                  {(formData.totalAmount || subtotal).toLocaleString()} VND
                </Typography>
              </Box>
              {formData.voucherCode && formData.discountAmount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography>Giảm giá ({formData.voucherCode}):</Typography>
                  <Typography fontWeight="bold" color="success.main">
                    -{formData.discountAmount.toLocaleString()} VND
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  pt: 1,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography fontWeight="bold">
                  Tổng cộng (Đã bao gồm VAT):
                </Typography>
                <Typography fontWeight="bold" color="primary">
                  {total.toLocaleString()} VND
                </Typography>
              </Box>
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Mã voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    fullWidth
                    placeholder="Nhập mã voucher"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApplyVoucher}
                    sx={{ minWidth: 100 }}
                  >
                    Áp dụng
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleOpenPaymentModal}
                  sx={{ alignSelf: "flex-start", minWidth: 100 }}
                  disabled={formData.status !== "confirmed"}
                >
                  Thanh toán
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <PaymentModal
        visible={paymentModalOpen}
        onCancel={handleClosePaymentModal}
        orderDetails={{
          order: {
            id: orderId || editingOrder?.id,
            final_amount: formData.finalAmount || total,
          },
          itemOrders: formData.items.map((item) => ({
            itemPrice: item.price,
            quantity: item.quantity,
            itemName: item.name,
          })),
        }}
        zIndex={1300}
      />
      <CancelItemsModal
        visible={cancelItemsModalOpen}
        onCancel={handleCloseCancelItemsModal}
        onSuccess={handleCancelItemsSuccess}
        orderId={orderId || editingOrder?.id}
        items={formData.items}
        zIndex={1300}
      />
    </Box>
  );
};

export default OrderBasicInfoView;
