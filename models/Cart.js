const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)