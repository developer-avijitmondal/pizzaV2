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
const emailNow = require('../helpers/email')


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
  Cart.findById(cart_id)
    .exec(function(err,data){
        if(err){
          res.status(500).json({ err : err })
        }else{
          if(data==null){
            res.status(404).json({ msg : 'invalid cart' })
          }else{
            const orderData = {
              cart_id:cart_id,
              cart:data,
              email: email,
              name:name,
              postCode:postCode,
              paymentMethod:paymentMethod
            }
            order = new Order(orderData);
            order.save()     
            async function send(){
              const deleteNow = await Cart.findOneAndDelete({ email:email })
              console.log(deleteNow);
              await emailNow.sendEmail(email);
            }
            send();
            res.status(200).json({ msg : order });  
          }
           
        }
  })
  

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
 * Get order list.
 * @property {number} req.query.skip - Number of orders to be skipped.
 * @property {number} req.query.limit - Limit number of orders to be returned.
 * @returns {Order[]}
 */

exports.list = async (req, res, next) => {
  console.log(req.query);
  const { email, sort = 'createdAt', limit = 50, skip = 0 } = req.query;
  // console.log(email);
  Order.find({ email : email })
  .exec(function(err,Data){
      if(err){
        // console.log('Opps There is some error in login !')
        res.status(404).json({ msg : 'no data found' })
      }else{
        //console.log(userData);
        res.status(200).json(Data);
      }
  }); 
};

 // exports.list = function (req, res, next) {
//   console.log(req.query);
//   const { email, sort = 'createdAt', limit = 50, skip = 0 } = req.query;
//   // console.log(email);
//   if (!email) {
//     throw new APIError('order email has not been provided!', httpStatus.BAD_REQUEST, true);
//   }
//   Order.list({ email, sort, limit, skip })
//     .then(orders => res.json(orders))
//     .catch(e => next(e));
// };
