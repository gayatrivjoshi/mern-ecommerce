const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { instance } = require('../server')
const { Order } = require('../models/order')
const {
  createe,
  listOrders,
  getStatusValues,
  orderById,
  updateOrderStatus,
} = require('../controllers/order');

const { decreaseQuantity } = require('../controllers/product');

router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  createe
);

router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

router.get(
  '/order/status-values/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);

router.put(
  '/order/:orderId/status/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);

router.post("/create/orderId", (req, res) => {
  const order = new Order(req.body.order);
  var options = {
    ...order,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.send({orderId : order.id})
  });
});

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;
