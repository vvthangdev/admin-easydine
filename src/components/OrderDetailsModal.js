import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Stack } from '@mui/material';
import { orderAPI } from '../services/apis/Order';
import { adminAPI } from '../services/apis/Admin';
import { toast } from 'react-toastify';

export default function OrderDetailsModal({ open, onClose, notificationData }) {
  const [orderInfo, setOrderInfo] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [staffName, setStaffName] = useState(null);
  const [cashierName, setCashierName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Log dữ liệu thông báo
  console.log("[OrderDetailsModal] Dữ liệu thông báo nhận được:", JSON.stringify(notificationData, null, 2));

  // Gọi API getOrderInfo và getCustomerDetails
  useEffect(() => {
    if (open && notificationData?.data?.orderId) {
      setLoading(true);
      setError(null);
      orderAPI
        .getOrderInfo({ id: notificationData.data.orderId })
        .then(async (response) => {
          setOrderInfo(response);
          // Gọi API lấy thông tin người dùng
          try {
            if (response.order?.customer_id) {
              const customer = await adminAPI.getCustomerDetails(response.order.customer_id);
              setCustomerName(customer.name || 'N/A');
            } else {
              setCustomerName('N/A');
            }
            if (response.order?.staff_id) {
              const staff = await adminAPI.getCustomerDetails(response.order.staff_id);
              setStaffName(staff.name || 'N/A');
            } else {
              setStaffName('N/A');
            }
            if (response.order?.cashier_id) {
              const cashier = await adminAPI.getCustomerDetails(response.order.cashier_id);
              setCashierName(cashier.name || 'N/A');
            } else {
              setCashierName('Không có');
            }
          } catch (userError) {
            console.error("[OrderDetailsModal] Lỗi khi lấy thông tin người dùng:", userError);
            toast.error("Không thể tải thông tin người dùng");
            setCustomerName('N/A');
            setStaffName('N/A');
            setCashierName('Không có');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("[OrderDetailsModal] Lỗi khi lấy thông tin đơn hàng:", error);
          setError("Không thể tải thông tin đơn hàng");
          toast.error("Không thể tải thông tin đơn hàng");
          setLoading(false);
        });
    }
  }, [open, notificationData]);

  console.log(`vvtdev: `, notificationData);

  // Format dữ liệu hiển thị
  const displayData = {
    title: notificationData?.message || "Thông báo đơn hàng",
    tables: orderInfo?.reservedTables?.map(t => `${t.table_number} (${t.area})`).join(", ") || "N/A",
    timestamp: notificationData?.timestamp
      ? new Date(notificationData?.timestamp).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).replace(",", "")
      : "N/A",
    items: orderInfo?.itemOrders?.map(item => ({
      itemName: item.itemName,
      quantity: item.quantity,
      note: item.note || "-",
      size: item.size || "-",
      price: item.itemPrice ? `${item.itemPrice.toLocaleString("vi-VN")} VND` : "N/A",
      total: item.itemPrice && item.quantity
        ? `${(item.itemPrice * item.quantity).toLocaleString("vi-VN")} VND`
        : "N/A",
    })) || [],
    order: orderInfo?.order ? {
      type: orderInfo.order.type || "N/A",
      status: orderInfo.order.status || "N/A",
    } : { type: "N/A", status: "N/A" },
    total_amount: orderInfo?.order?.final_amount
      ? `${orderInfo.order.final_amount.toLocaleString("vi-VN")} VND`
      : "N/A",
    customer: customerName || "N/A",
    staff: staffName || "N/A",
    cashier: cashierName || "Không có",
  };

  console.log("[OrderDetailsModal] Dữ liệu orderInfo:", orderInfo);

  // Hàm in phiếu
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Phiếu gọi món</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10mm; font-size: 12px; }
            .print-container { width: 80mm; }
            h2 { font-size: 14px; text-align: center; margin-bottom: 5mm; }
            .info { margin-bottom: 5mm; }
            .info p { margin: 2mm 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 5mm; }
            th, td { border: 1px solid #000; padding: 2mm; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .no-print { display: none; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h2>${displayData.title}</h2>
            <div class="info">
              <p><strong>Khách hàng:</strong> ${displayData.customer}</p>
              <p><strong>Nhân viên:</strong> ${displayData.staff}</p>
              <p><strong>Bàn:</strong> ${displayData.tables}</p>
              <p><strong>Thời gian:</strong> ${displayData.timestamp}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Món</th>
                  <th style="text-align: center;">Số lượng</th>
                  <th>Kích cỡ</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                ${displayData.items.map(item => `
                  <tr>
                    <td>${item.itemName}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td>${item.size}</td>
                    <td>${item.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {displayData.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>Khách hàng:</strong> {displayData.customer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Nhân viên:</strong> {displayData.staff}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Thu ngân:</strong> {displayData.cashier}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Bàn:</strong> {displayData.tables}
            </Typography>
            {displayData.items.length > 0 && (
              <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Table sx={{ minWidth: 500 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Món</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Số lượng</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Kích cỡ</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Giá (VND)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{item.quantity}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.note}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Typography variant="body2" color="text.secondary">
              <strong>Loại đơn hàng:</strong> {displayData.order.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Trạng thái:</strong> {displayData.order.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Tổng tiền:</strong> {displayData.total_amount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Thời gian:</strong> {displayData.timestamp}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handlePrint}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 20, textTransform: "none", marginRight: 1 }}
          disabled={loading || error || !orderInfo}
        >
          In phiếu hàng
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 20, textTransform: "none", borderColor: "#d1d1d6", color: "#1c1c1e" }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};