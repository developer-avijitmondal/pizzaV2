const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
// const validate = require('express-validation');
// const config = require('../config/index');
// const paramValidation = require('../config/param-validation');

router.get('/', OrderController.list);
// router.get('/email', OrderController.sendEmail);
router.post('/create', OrderController.placeOrder);
router.get('/:orderId', OrderController.get);
router.param('orderId', OrderController.load);
module.exports = router;

// config.jwtMiddleware,
// validate(paramValidation.createOrder),
// const temp1 = {
//   billingAddress: {
//     name: 'ldfjdlsjf',
//     email: 'flsdjf@lsjf.com',
//     postCode: '2321',
//     district: 'Sherpur',
//     country: 'BD'
//   },
//   shippingMethod: 'ups',
//   paymentMethod: 'skrill'
// };
