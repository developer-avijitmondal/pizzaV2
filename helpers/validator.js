const { check } = require('express-validator');

exports.addCart = [
    check('productId','productId is required').not().isEmpty(),
    check('quantity','productId is required').not().isEmpty()
];

exports.createProduct = [
    check('name','name is required').not().isEmpty(),
    check('price','price is required').not().isEmpty(),
    check('image', 'image is required').not().isEmpty()

]

// exports.anotherRoute = [// check data];

// exports.doSomethingElse = [// check data]
