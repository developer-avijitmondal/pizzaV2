const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

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

const OrderScema = new Schema({
  cart_id: {
    type: String,
    required: true
  },
  cart: [CartSchema],
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /[\w]+?@[\w]+?\.[a-z]{2,4}/,
      'The value of path {PATH} ({VALUE}) is not a valid email address.'
    ]
  },
  postCode: {
    type: String,
    required: true,
    match: [
      /[\d]{4,5}/,
      'The value of path {PATH} ({VALUE}) is not a valid post code.'
    ]
  },
  paymentMethod: {
    type: String,
    default: '"cash_on_delivery"'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Statics
 */
OrderScema.statics = {
  /**
   * Get Order
   * @param {ObjectId} id - The objectId of order.
   * @returns {Promise<Order, APIError>}
   */
  get (id) {
    return this.findById(id)
      .exec()
      .then(order => {
        if (order) {
          return order;
        }
        const err = new APIError(
          'No such product exists!',
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  /**
   * List orders in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of orders to be skipped.
   * @param {number} limit - Limit number of orders to be returned.
   * @returns {Promise<Order[]>}
   */
  list ({ email, sort = 'createdAt', skip = 0, limit = 50 } = {}) {
    let condition = { 'user.email': email };
    return this.find(condition)
      .sort({ [sort]: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model('order', OrderScema);
