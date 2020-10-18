const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
require('dotenv').config();
var API_KEY = process.env.API_key;
var DOMAIN = process.env.API_base_URL;
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
const maingun = require('../helpers/email');
var mg = require('nodemailer-mailgun-transport');
var nodemailer = require('nodemailer');
var auth =  require('../config/config.json');
const { check, body, validationResult } = require('express-validator');
const email = require('../helpers/email')


// sendMail = function(sender_email, reciever_email, 
//   email_subject, email_body){ 

//   const data = { 
//   "from": sender_email, 
//   "to": reciever_email, 
//   "subject": email_subject, 
//   "text": email_body 
//   }; 

//   mailgun.messages().send(data, (error, body) => { 
//   if(error) console.log(error) 
//   else console.log(body); 
//   }); 
// } 

exports.makeOrder = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // console.log(req.body);
  const { cart_id,email,name,postCode,paymentMethod } = req.body;
  const orderData = {
    cart_id:cart_id,
    email: email,
    name:name,
    postCode:postCode,
    paymentMethod:paymentMethod
  }
  order =  new Order(cartData);
  order.save()
  res.json(order);
}


/**
 * Load product and append to req.
 */
exports.load = function (req, res, next, id) {
  Order.get(id)
    .then(order => {
      req.order = order; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(err => {
      const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
      return next(error);
    });
};

exports.get = function (req, res, next) {
  return res.json(req.order);
};

/**
 * Create new order
 * @returns {Order}
 */

exports.placeOrder = function (req, res, next) {
  console.log(req.body);
  // res.json(req.body);
  if (!(Array.isArray(req.body.items) && req.body.items.length)) {
    const err = new APIError('No order items included', httpStatus.UNPROCESSABLE_ENTITY, true);
    return next(err);
  }
  const orderData = {
    user: req.body.user,
    billingAddress: req.body.billingAddress,
    shippingMethod: req.body.shippingMethod,
    paymentMethod: req.body.paymentMethod
  };
  orderData.items = req.body.items.map(item => {
    return {
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty
    };
  });
  orderData.grandTotal = req.body.items.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
  // console.log(orderData);
  const order = new Order(orderData);

  order
    .save()
    .then(savedOrder => {
      const allProductPromises = savedOrder.items.map(item => {
        return Product.get(item.productId).then(product => {
          product.quantity = product.quantity - item.qty;
          return product.save();
        });
      });
      Promise.all(allProductPromises)
        .then(data => {
          return Cart.get(savedOrder.user);
        })
        .then(cart => {
          cart.items = [];
          return cart.save();
        })
        .then(data => {
          res.json(savedOrder);
        })
        .catch(err => {
          // console.log(err);
          const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
          return next(error);
        });
    })
    .catch(err => {
      // console.log(err);
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};

/**
 * Get order list.
 * @property {number} req.query.skip - Number of orders to be skipped.
 * @property {number} req.query.limit - Limit number of orders to be returned.
 * @returns {Order[]}
 */

exports.list = function (req, res, next) {
  const { email, sort = 'createdAt', limit = 50, skip = 0 } = req.query;
  // console.log(email);
  if (!email) {
    throw new APIError('order email has not been provided!', httpStatus.BAD_REQUEST, true);
  }
  Order.list({ email, sort, limit, skip })
    .then(orders => res.json(orders))
    .catch(e => next(e));
};
