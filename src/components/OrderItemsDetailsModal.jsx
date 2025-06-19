import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import { orderAPI } from "../services/apis/Order";
import { adminAPI } from "../services/apis/Admin";
import { toast } from "react-toastify";

export default function OrderItemsDetailsModal({ open, onClose, notificationData }) {
  const [orderInfo, setOrderInfo] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [staffName, setStaffName] = useState(null);
  const [cashierName, setCashierName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Log dữ liệu thông báo
  console.log(
    "[OrderItemsDetailsModal] Dữ liệu thông báo nhận được:",
    JSON.stringify(notificationData, null, 2)
  );

  // Gọi API getOrderInfo và getCustomerDetails
  useEffect(() => {
    if (open && notificationData?.data?.orderId) {
      setLoading(true);
      setError(null);
      orderAPI
        .getOrderInfo({ id: notificationData.data.orderId })
        .then(async (response) => {
          setOrderInfo(response);
          try {
            if (response.order?.customer_id) {
              const customer = await adminAPI.getCustomerDetails(response.order.customer_id);
              setCustomerName(customer.name || "N/A");
            } else {
              setCustomerName("N/A");
            }
            if (response.order?.staff_id) {
              const staff = await adminAPI.getCustomerDetails(response.order.staff_id);
              setStaffName(staff.name || "N/A");
            } else {
              setStaffName("N/A");
            }
            if (response.order?.cashier_id) {
              const cashier = await adminAPI.getCustomerDetails(response.order.cashier_id);
              setCashierName(cashier.name || "N/A");
            } else {
              setCashierName("N/A");
            }
          } catch (userError) {
            console.error("[OrderItemsDetailsModal] Lỗi khi lấy thông tin người dùng:", userError);
            toast.error("Không thể tải thông tin người dùng");
            setCustomerName("N/A");
            setStaffName("N/A");
            setCashierName("N/A");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("[OrderItemsDetailsModal] Lỗi khi lấy thông tin đơn hàng:", error);
          setError("Không thể tải thông tin đơn hàng");
          toast.error("Không thể tải thông tin đơn hàng");
          setLoading(false);
        });
    }
  }, [open, notificationData]);

  // Format dữ liệu hiển thị
  const displayData = {
    title: notificationData?.message || "Cập nhật món ăn",
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
    items: notificationData?.data?.addedItems || notificationData?.data?.canceledItems || [],
    order: orderInfo?.order
      ? {
          type: orderInfo.order.type || "N/A",
          status: orderInfo.order.status || "N/A",
          total_amount: orderInfo.order.total_amount || 0,
          final_amount: orderInfo.order.final_amount || 0,
          discount_amount: orderInfo.order.discount_amount || 0,
          voucher_code: orderInfo.order.voucher_code || null,
          payment_method: orderInfo.order.payment_method || "Tiền mặt",
        }
      : { type: "N/A", status: "N/A", total_amount: 0, final_amount: 0, discount_amount: 0, payment_method: "Tiền mặt" },
    customer: customerName || "N/A",
    staff: { name: staffName || "N/A" },
    cashier: { name: cashierName || "N/A" },
    reservedTables: orderInfo?.order?.reservedTables || [{ table_number: "N/A", capacity: 1, start_time: null }],
  };

  console.log("[OrderItemsDetailsModal] Dữ liệu orderInfo:", orderInfo);

  // Hàm tạo nội dung HTML cho in hóa đơn
  const generatePrintHTML = (orderDetails, staffInfo, cashierInfo) => {
    if (!orderDetails) return '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Phiếu Cập Nhật</title>
          <meta charset="utf-8">
          <style>
            @page { 
              margin: 5mm; 
              size: 80mm auto;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Courier New', monospace;
              font-size: 10px;
              line-height: 1.4;
              color: black;
              width: 80mm;
            }
            .receipt-container {
              width: 100%;
              max-width: 80mm;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px dashed black;
            }
            .company-name {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 3px;
            }
            .receipt-title {
              font-size: 11px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            .info-section {
              margin-bottom: 10px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .info-row span:first-child {
              flex: 1;
            }
            .info-row span:last-child {
              font-weight: bold;
              max-width: 50%;
              word-wrap: break-word;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            .table-header {
              border-top: 1px solid black;
              border-bottom: 1px solid black;
              font-weight: bold;
              font-size: 9px;
            }
            .table-header td {
              padding: 3px 2px;
            }
            .item-row td {
              padding: 3px 2px;
              font-size: 9px;
              vertical-align: top;
            }
            .item-row td:nth-child(1) {
              width: 50%;
              max-width: 40mm;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-row td:nth-child(2) {
              width: 15%;
              text-align: center;
            }
            .item-row td:nth-child(3) {
              width: 35%;
              word-wrap: break-word;
              max-width: 25mm;
            }
            .item-note {
              font-size: 8px;
              color: #666;
              font-style: italic;
              display: block;
              margin-top: 2px;
            }
            .footer {
              text-align: center;
              font-weight: bold;
              margin-top: 10px;
              font-size: 10px;
            }
            .separator {
              border-top: 1px dashed black;
              margin: 5px 0;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header -->
            <div class="header">
              <div class="company-name">EasyDine</div>
              <div>vvthang.dev@gmail.com</div>
            </div>
            <!-- Receipt Title -->
            <div class="receipt-title">${orderDetails.title || "CẬP NHẬT MÓN ĂN"}</div>

            <!-- Order Info -->
            <div class="info-section">
              <div class="info-row">
                <span>Bàn:</span>
                <span>${notificationData?.data?.table || "N/A"}</span>
              </div>
              <div class="info-row">
                <span>Khách:</span>
                <span>${orderDetails.reservedTables?.[0]?.capacity || "1"}</span>
              </div>
              <div class="info-row">
                <span>Giờ đặt:</span>
                <span>${notificationData?.timestamp
                  ? new Date(notificationData?.timestamp).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1.$2.$3')
                  : "N/A"}</span>
              </div>
              <div class="info-row">
                <span>Giờ in:</span>
                <span>${new Date().toLocaleString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1.$2.$3')}</span>
              </div>
              <div class="info-row">
                <span>Nhân viên:</span>
                <span>${staffInfo.name}</span>
              </div>
            </div>

            <!-- Items Table -->
            <table class="items-table">
              <tr class="table-header">
                <td style="width: 50%;">Món</td>
                <td style="width: 15%; text-align: center;">SL</td>
                <td style="width: 35%; text-align: left;">Ghi chú</td>
              </tr>
              ${orderDetails.items?.map(item => `
                <tr class="item-row">
                  <td>
                    ${item.itemName || "N/A"}${item.size && item.size !== "Mặc định" ? ` / ${item.size}` : ""}
                  </td>
                  <td style="text-align: center;">${item.quantity || 0}</td>
                  <td>
                    ${item.note && item.note !== "Không có" ? `<span class="item-note">${item.note}</span>` : "-"}
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="3">Không có món ăn nào</td></tr>'}
            </table>

            <div class="separator"></div>

            <!-- Footer -->
            <div class="footer">
              <div>CẢM ƠN QUÝ KHÁCH</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Hàm xử lý in hóa đơn
  const handlePrint = () => {
    if (!orderInfo || !displayData.items.length) {
      toast.error("Không có dữ liệu để in!");
      return;
    }

    const printContent = generatePrintHTML(displayData, displayData.staff, displayData.cashier);
    const printWindow = window.open('', '', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 100);
      };
    } else {
      toast.error("Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker!");
    }
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
          <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" } }}>
            {/* Cột trái: Thông tin đơn hàng */}
            <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "200px" } }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Khách hàng:</strong> {displayData.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nhân viên:</strong> {displayData.staff.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Thu ngân:</strong> {displayData.cashier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Loại đơn hàng:</strong> {displayData.order.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Trạng thái:</strong> {displayData.order.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Thời gian:</strong> {displayData.timestamp}
                </Typography>
              </Stack>
            </Box>
            {/* Cột phải: Danh sách món ăn */}
            {displayData.items.length > 0 && (
              <Box sx={{ flex: 2, minWidth: { xs: "100%", md: "300px" } }}>
                <TableContainer component={Paper} sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  <Table sx={{ minWidth: 300 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Món</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>SL</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Kích cỡ</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{item.quantity}</TableCell>
                          <TableCell>{item.size || "-"}</TableCell>
                          <TableCell>{item.note || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
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
          In phiếu
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 20,
            textTransform: "none",
            borderColor: "#d1d1d6",
            color: "#1c1c1e",
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}