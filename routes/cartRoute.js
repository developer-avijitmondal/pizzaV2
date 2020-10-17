const router = require("express").Router();
const cartController = require("../controllers/cartController");
const auth = require('../middleware/auth');
const validator = require("../helpers/validator"); 

// router.post("/", auth, validator.addCart, cartController.addItemToCart);
router.post("/", auth, validator.addCart, cartController.newToCart);//newToCart
router.get("/", auth, cartController.getCart);
router.delete("/empty-cart", auth, cartController.emptyCart);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const CartController = require('../controllers/cartController');
// // const validate = require('express-validation');
// // const config = require('../config/index');
// // const paramValidation = require('../config/param-validation');

// router.get('/', CartController.get);
// router.post('/add', CartController.add);
// router.post('/subtract', CartController.subtract);
// router.get('/', CartController.remove);
// // router.post('/add', CartController.add);
// module.exports = router;
