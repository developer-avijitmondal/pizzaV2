const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

const CartSchema = new Schema({
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    },
    email: {
      type: String,
      //required: true,
      match: [
        /[\w]+?@[\w]+?\.[a-z]{2,4}/,
        'The value of path {PATH} ({VALUE}) is not a valid email address.'
      ]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
}, {
    timestamps: true
})


// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
// var ItemSchema = new Schema({
//   product_id: {
//     type: String,
//     required: true
//   },
//   qty: {
//     type: Number,
//     required: true,
//     min: [1, 'Quantity can not be less then 1.']
//   },
//   price: {
//       type: Number,
//       //required: true
//   },
//   total: {
//       type: Number,
//       //required: true,
//   }
// });
// const CartSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     match: [
//       /[\w]+?@[\w]+?\.[a-z]{2,4}/,
//       'The value of path {PATH} ({VALUE}) is not a valid email address.'
//     ]
//   },
//   items: [ItemSchema],
//   subTotal: {
//       default: 0,
//       type: Number
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// /**
//  * Statics
//  */
// CartSchema.statics = {
//   /**
//    * get cart
//    * @param {string} email - cart email.
//    * @returns {Promise<Cart[]>}
//    */
//   get ({ email } = {}) {
//     let condition = { email: email };
//     return this.findOne(condition).exec();
//   }
// };

module.exports = mongoose.model('cart', CartSchema);


