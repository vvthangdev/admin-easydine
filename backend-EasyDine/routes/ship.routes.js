// const express = require("express");
// const router = express.Router(); // create router to define 

// // method need to define 

// /*
//     1.create order 
//     2.set state order
//     3.
// */

// router.get('/', )
// router.post('/', )

// router
// module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tạo đơn hàng
router.post('/create', authMiddleware, orderController.createOrder);

// Thanh toán
router.post('/pay/:orderId', authMiddleware, orderController.payOrder);

// Cập nhật trạng thái đơn hàng
router.put('/update-status/:orderId', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
