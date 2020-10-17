const router = require("express").Router();
const productController = require("../controllers/productController");
const multerInstance = require('../helpers/multer')
const validator = require("../helpers/validator"); 

router.post("/", multerInstance.upload.single('image'), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.removeProduct);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// // const validate = require('express-validation');
// const { validate, ValidationError, Joi } = require('express-validation')
// // const config = require('../config/index');
// const auth = require('../middleware/auth');
// const paramValidation = require('../config/param-validation');
// const ProductController = require('../controllers/product');
// const multerInstance = require('../helpers/multer')

// router
//   .route('/')
//   /** GET /api/products - Get list of products */
//   .get(ProductController.list)

//   /** POST /api/products - Create new product */
//   .post(
//     auth,
//     multerInstance.upload.single('image'),
//     validate(paramValidation.createProduct),
//     ProductController.create
//   );

// router
//   .route('/:productId')
//   /** GET /api/products/:productId - Get product */
//   .get(ProductController.get)

//   /** PUT /api/products/:productId - Update product */
//   .put(
//     auth,
//     validate(paramValidation.updateProduct),
//     ProductController.update
//   )
//   // const checkScopes = jwtAuthz([ 'delete:products' ]);
//   /** DELETE /api/products/:productId - Delete product */
//   .delete(auth, ProductController.remove);

// /** Load user when API with productId route parameter is hit */
// router.param('productId', ProductController.load);

// module.exports = router;
