const Cart = require('../models/Cart')
const Book = require('../models/Book')

const getCart = async (req, res) => {
  const { user } = req.body
  let cart = await Cart.findOne({ user }).exec();

  if (!cart) {
    cart = await Cart.create({ user })
  }

  const booksInCart = await Book.find({ _id: { $in: cart.cart } });

  res.status(200).json({ cart: booksInCart })
}

const updateCart = async (req, res) => {
  const { cart, user } = req.body

  let curCart = await Cart.findOne({ user }).exec();


  if (!curCart) {
    curCart = await Cart.create({ user })
  }

  curCart.cart = cart

  const updatedCart = await curCart.save()
  res.status(200).json(updatedCart)
}

module.exports = {
  getCart,
  updateCart
}