const cartRepository = require('../helpers/cartRepository')
const productRepository = require('../helpers/repository');
const { check, body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');
const Product = require('../models/Product');
const User = require('../models/User');
  
  /**
   * Get cart by email.
   * @property {string} req.query.email
   * @returns {Cart}
   */
  exports.get = function (req, res, next) {
    const { email } = req.query;
    console.log(req.query);
    //console.log(email);
    if (!email) {
      const error = new APIError('Invalid request', httpStatus.BAD_REQUEST, true);
      return next(error);
    }
    Cart.findOne({ email:email }).exec()
      .then(Cart => res.json(Cart))
      .catch(err => {
        const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
        return next(error);
      });
  };
  
  /**
   * delete cart by email.
   * @property {string} req.query.email
   * @returns {Cart}
   */
  exports.remove = function (req, res, next) {
    const { email } = req.query;
    Cart.findOneAndRemove({ email:email }).exec()
      .then(
        res.status(200).json({ msg : 'cart removed' })
      )
      .catch(err => {
        const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
        return next(error);
      });
  };
  

//end new 

exports.newToCart = async (req, res) => {
    const { email, productId } = req.body;
    const product_id = productId;
    
    const quantity = Number.parseInt(req.body.quantity);
    const qty = quantity;
    console.log(req.body);
    // let productDetails = await productRepository.productById(productId);
    //         if (!productDetails) {
    //         return res.status(500).json({
    //             type: "Not Found",
    //             msg: "Invalid product"
    //         })
    // }
    /******************new code*********************/
    let user = await User.findOne({email:email})
    if(!user){
      return res.status(400).json({errors:[{msg:"No user found with this credentials"}]});
    }else{
      const cart = await Cart.findOne({ email:email }).exec()
      .then(cart => {
        console.log('get cart');
        console.log(cart);
        console.log('end cart');
        // res.json({ msg : cart })
  
        if (!cart && quantity <= 0) { //if quantity less than 1
          throw new Error('Invalid request');
        } else if (cart) { //if user cart found
          //---- Check if index exists ----
          const indexFound = cart.items.findIndex(item => {
            return item.productId === productId;
          });
  
          console.log('indexFound');
          console.log(indexFound);
          console.log('end indexFound');
          Product.findById(productId, function (err, productDetails) { 
            if(err){
              console.log('not found');
            }else{
              //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
              if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
                console.log('cart 1');
                console.log(cart);
                console.log('end cart 1');
            }
            //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                console.log('cart 2');
                console.log(cart);
                console.log('end cart 2');
            }
            //----Check if quantity is greater than 0 then add item to items array ----
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                console.log('cart 3');
                console.log(cart);
                console.log('end cart 3');
            }
            //----If quantity of price is 0 throw the error -------
            else {
              return res.status(400).json({
                type: "Invalid",
                msg: "Invalid request"
              })
            }
            cart.save();
            return res.status(200).json({ data : cart });
              // res.status(200).json({
              //     type: "success",
              //     mgs: "Process Successful",
              //     data: data
              // })
            }
          });
          
          // res.status(200).json({
          //     type: "success",
          //     mgs: "Process Successful",
          //     data: cart
          // })
        }
        //------------ This creates a new cart and then adds the item to the cart that has been created------------
        else{ //new cart
          console.log('save new cart');
          Product.findById(productId, function (err, productDetails) { 
            if(err){
              console.log('not found');
            }else{
              const cartData = {
                email: email,
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity)
              }
              cart =  new Cart(cartData);
              cart.save()
              res.json(cart);
              console.log(cart);
            }
          });
  
        }
      }).catch(err => {
        res.json(err);
      })
    }
    

}

// exports.addItemToCart = async (req, res) => {
// //   const {
// //       productId
// //   } = req.body;
//   const { email, productId } = req.body;
//   const quantity = Number.parseInt(req.body.quantity);
//   try {
//       let cart = await cartRepository.cart();
//       let productDetails = await productRepository.productById(productId);
//            if (!productDetails) {
//           return res.status(500).json({
//               type: "Not Found",
//               msg: "Invalid request"
//           })
//       }
//       //--If cart exists ----
//       if (cart) {
//           //---- Check if index exists ----
//           const indexFound = cart.items.findIndex(item => item.productId.id == productId);
//           //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
//           if (indexFound !== -1 && quantity <= 0) {
//               cart.items.splice(indexFound, 1);
//               if (cart.items.length == 0) {
//                   cart.subTotal = 0;
//               } else {
//                   cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
//               }
//           }
//           //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
//           else if (indexFound !== -1) {
//               cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
//               cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
//               cart.items[indexFound].price = productDetails.price
//               cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
//           }
//           //----Check if quantity is greater than 0 then add item to items array ----
//           else if (quantity > 0) {
//               cart.items.push({
//                   productId: productId,
//                   quantity: quantity,
//                   price: productDetails.price,
//                   total: parseInt(productDetails.price * quantity)
//               })
//               cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
//           }
//           //----If quantity of price is 0 throw the error -------
//           else {
//               return res.status(400).json({
//                   type: "Invalid",
//                   msg: "Invalid request"
//               })
//           }
//           let data = await cart.save();
//           res.status(200).json({
//               type: "success",
//               mgs: "Process Successful",
//               data: data
//           })
//       }
//       //------------ This creates a new cart and then adds the item to the cart that has been created------------
//       else {
//           const cartData = {
//               items: [{
//                   productId: productId,
//                   quantity: quantity,
//                   total: parseInt(productDetails.price * quantity),
//                   price: productDetails.price
//               }],
//               subTotal: parseInt(productDetails.price * quantity)
//           }
//           cart = await cartRepository.addItem(cartData)
//           // let data = await cart.save();
//           res.json(cart);
//       }
//   } catch (err) {
//       console.log(err)
//       res.status(400).json({
//           type: "Invalid",
//           msg: "Something Went Wrong",
//           err: err
//       })
//   }
// }


