const Cart = require('../models/Cart')
const Book = require('../models/Book')

const getCart = async (req, res) => {
  try {
    const { user } = req.body;
    let cart = await Cart.findOne({ user }).exec();

    if (!cart) {
      cart = await Cart.create({ user });
    }

    const bookIds = cart.cart;


    if (bookIds.length === 0) {
      return res.status(200).json({ cart: [] });
    }

    const cartList = await Promise.all(bookIds.map(id => Book.findById(id).exec()));

    res.status(200).json({ cart: cartList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateCart = async (req, res) => {
  const { cart, user } = req.body;

  const ids = cart.length > 0 ? cart.map(book => book._id) : []

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user },
      { cart: ids },
      { new: true, upsert: true }
    ).exec();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getCart,
  updateCart
}