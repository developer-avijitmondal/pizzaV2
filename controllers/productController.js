const productRepository = require('../helpers/repository')
const { check, body, validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        let payload = {
            name: req.body.name,
            price: req.body.price,
            image: req.file.path
        }
        let product = await productRepository.createProduct({
            ...payload
        });
        res.status(200).json({
            status: true,
            data: product,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            status: false,
        })
    }
}
exports.getProducts = async (req, res) => {
    try {
        let products = await productRepository.products();
        res.status(200).json({
            status: true,
            data: products,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            status: false,
        })
    }
}
exports.getProductById = async (req, res) => {
    try {
        let id = req.params.id
        let productDetails = await productRepository.productById(id);
        res.status(200).json({
            status: true,
            data: productDetails,
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err
        })
    }
}
exports.removeProduct = async (req, res) => {
    try {
        let id = req.params.id
        let productDetails = await productRepository.removeProduct(id)
        res.status(200).json({
            status: true,
            data: productDetails,
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err
        })
    }
}

// const httpStatus = require('http-status');
// const APIError = require('../helpers/APIError');
// const Product = require('../models/Product');

// /**
//  * Load user and append to req.
//  */
// exports.load = function (req, res, next, id) {
//   Product.get(id)
//     .then(product => {
//       req.product = product; // eslint-disable-line no-param-reassign
//       return next();
//     })
//     .catch(err => {
//       const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
//       return next(error);
//     });
// };

// exports.get = function (req, res, next) {
//   return res.json(req.product);
// };

// /**
//  * Create new user
//  * @property {string} req.body.username - The username of user.
//  * @property {string} req.body.mobileNumber - The mobileNumber of user.
//  * @returns {User}
//  */

// exports.create = function (req, res, next) {
//   const productData = {
//     name: req.body.name,
//     category: req.body.category,
//     brand: req.body.brand,
//     price: req.body.price,
//     quantity: req.body.quantity
//   };
//   if (req.body.model) {
//     productData.model = req.body.model;
//   }
//   if (req.body.specification) {
//     productData.specification = req.body.specification;
//   }
//   const product = new Product(productData);

//   product
//     .save()
//     .then(savedProduct => res.json(savedProduct))
//     .catch(e => next(e));
// };
// /**
//  * Update existing user
//  * @property {string} req.body.username - The username of user.
//  * @property {string} req.body.mobileNumber - The mobileNumber of user.
//  * @returns {User}
//  */
// exports.update = function (req, res, next) {
//   const product = req.product;

//   product.name = req.body.name ? req.body.name : product.name;
//   product.brand = req.body.brand ? req.body.brand : product.brand;
//   product.category = req.body.category ? req.body.category : product.category;
//   product.model = req.body.model ? req.body.model : product.model;
//   product.specification = req.body.specification ? req.body.specification : product.specification;
//   product.quantity = req.body.quantity ? req.body.quantity : product.quantity;
//   product.price = req.body.price ? req.body.price : product.price;

//   product
//     .save()
//     .then(savedProduct => res.json(savedProduct))
//     .catch(e => next(e));
// };

// /**
//  * Get user list.
//  * @property {number} req.query.skip - Number of products to be skipped.
//  * @property {number} req.query.limit - Limit number of products to be returned.
//  * @returns {Product[]}
//  */
// exports.list = function (req, res, next) {
//   console.log(req.query);
//   const {
//     category = '',
//     brand = '',
//     sort = 'quantity',
//     sorder = 'desc',
//     limit = 50,
//     skip = 0
//   } = req.query;
//   Product.list({category, brand, sort, sorder, limit, skip })
//     .then(products => res.json(products))
//     .catch(e => next(e));
// };

// /**
//  * Delete Product.
//  * @returns {Product}
//  */
// exports.remove = function (req, res, next) {
//   const product = req.product;
//   product
//     .remove()
//     .then(deletedProduct => res.json(deletedProduct))
//     .catch(e => next(e));
// };

