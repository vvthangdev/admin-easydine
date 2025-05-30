import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { orderAPI } from "../../../services/apis/Order";
import { userAPI } from "../../../services/apis/User";
import { adminAPI } from "../../../services/apis/Admin";
import { toast } from "react-toastify";
import PrintIcon from "@mui/icons-material/Print";
import InvoiceDetails from "./InvoiceDetails";
import PrintService from "./PrintService";

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order_id");
  const [orderDetails, setOrderDetails] = useState(null);
  const [staffInfo, setStaffInfo] = useState({ name: "N/A" });
  const [customerInfo, setCustomerInfo] = useState({
    name: "N/A",
    phone: "N/A",
    address: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

  // Fetch order details, staff, and customer info
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrderInfo({ id: orderId });
        setOrderDetails(response);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Không thể tải thông tin đơn hàng!");
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchStaffInfo = async (staffId) => {
      try {
        const response = await userAPI.getUserById({ id: staffId });
        setStaffInfo({
          name: response?.name || "N/A",
        });
      } catch (error) {
        console.error("Error fetching staff information:", error);
        setStaffInfo({ name: "N/A" });
      }
    };

    const fetchCustomerInfo = async (customerId) => {
      try {
        const response = await adminAPI.getCustomerDetails(customerId);
        setCustomerInfo({
          name: response.name || "N/A",
          phone: response.phone || "N/A",
          address: response.address || "N/A",
        });
      } catch (error) {
        console.error("Error fetching customer information:", error);
        setCustomerInfo({
          name: "N/A",
          phone: "N/A",
          address: "N/A",
        });
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }

    if (orderDetails?.order?.staff_id) {
      fetchStaffInfo(orderDetails.order.staff_id);
    }
    if (orderDetails?.order?.customer_id) {
      fetchCustomerInfo(orderDetails.order.customer_id);
    }
  }, [orderId, orderDetails?.order?.staff_id, orderDetails?.order?.customer_id]);

  // Handle print invoice
  const handlePrint = () => {
    if (!orderDetails) {
      toast.error("Không có dữ liệu để in!");
      return;
    }

    PrintService.printInvoice(orderDetails, staffInfo);
  };

  return (
    <Box sx={{ p: 3, maxWidth: "80vw", margin: "auto", '@media print': { display: 'none' } }}>
      <Typography
        variant="h4"
        color="success.main"
        gutterBottom
        textAlign="center"
      >
        Thanh toán thành công!
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        gutterBottom
      >
        Đơn hàng: {orderId || "N/A"}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
        sx={{ mb: 3, display: 'block', mx: 'auto' }}
        aria-label="In hóa đơn"
        disabled={!orderDetails}
      >
        In Hóa Đơn
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : orderDetails ? (
        <InvoiceDetails
          ref={invoiceRef}
          orderDetails={orderDetails}
          customerInfo={customerInfo}
          staffInfo={staffInfo}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Không thể tải thông tin chi tiết đơn hàng.
        </Typography>
      )}
    </Box>
  );
};

export default PaymentSuccess;