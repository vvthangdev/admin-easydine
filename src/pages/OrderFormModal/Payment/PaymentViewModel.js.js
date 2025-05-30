// /components/PaymentModal/PaymentViewModel.js
import { useState } from "react";
import { toast } from "react-toastify";
import { orderAPI } from "../../../services/apis/Order";

export const usePaymentViewModel = (orderDetails, onCancel) => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!orderDetails?.order?.id) {
      toast.error("Không tìm thấy đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod !== "vnpay") {
        toast.info("Chức năng thanh toán bằng tiền mặt hoặc chuyển khoản đang phát triển!");
        return;
      }

      // Kiểm tra thông tin đơn hàng
      const orderInfo = await orderAPI.getOrderInfo({ id: orderDetails.order.id });
      if (orderInfo.order.status !== "confirmed") {
        toast.error("Đơn hàng cần được xác nhận trước khi thanh toán!");
        return;
      }
      if (orderInfo.order.payment_status === "success") {
        toast.error("Đơn hàng đã được thanh toán!");
        return;
      }

      // Tính số tiền
      const amount =
        orderDetails.order.final_amount ||
        orderDetails.itemOrders?.reduce(
          (total, item) => total + item.itemPrice * item.quantity,
          0
        ) ||
        0;

      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        return;
      }

      // Gửi yêu cầu tạo URL thanh toán VNPay
      const response = await orderAPI.createPayment({
        order_id: orderDetails.order.id,
        amount,
        order_desc: `Thanh toan don hang ${orderDetails.order.id}`,
        language: "vn",
        payment_method: "vnpay",
      });

      // Kiểm tra và chuyển hướng đến URL VNPay
      if (response.vnpUrl && typeof response.vnpUrl === "string" && response.vnpUrl.startsWith("https://")) {
        window.location.href = response.vnpUrl;
      } else {
        throw new Error("URL thanh toán không hợp lệ!");
      }
    } catch (error) {
      console.error("Error processing VNPay payment:", error);
      toast.error(error.message || "Lỗi khi xử lý thanh toán VNPay. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return {
    paymentMethod,
    loading,
    handlePayment,
    handlePaymentMethodChange,
    onCancel,
  };
};