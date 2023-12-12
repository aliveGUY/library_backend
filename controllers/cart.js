const Cart = require('../models/Cart')
const Book = require('../models/Book')

const getCart = async (req, res) => {
  const { user } = req.body;
  let cart = await Cart.findOne({ user }).exec();

  console.log(cart);

  if (!cart) {
    cart = await Cart.create({ user });
  }

  const bookIds = cart.cart;

  const idOccurrences = bookIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const uniqueBookIds = [...new Set(bookIds)];
  const booksInCart = await Book.find({ _id: { $in: uniqueBookIds } });

  const booksWithDuplicates = booksInCart.flatMap((book) => {
    const occurrences = idOccurrences[book._id.toString()] || 1;
    return Array.from({ length: occurrences }, () => book);
  });

  res.status(200).json({ cart: booksWithDuplicates });
};

const updateCart = async (req, res) => {
  const { cart, user } = req.body;

  const ids = cart.map(book => book._id);

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