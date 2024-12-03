const orderService = require('../services/orderService');

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thanh toán
exports.payOrder = async (req, res) => {
  try {
    const payment = await orderService.processPayment(req.params.orderId, req.body.paymentDetails);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng sau khi thanh toán thành công
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.orderId, 'success');
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
