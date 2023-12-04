const express = require('express')
const router = express.Router()
const booksController = require('../controllers/books')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(booksController.getAllBooks)
    .post(verifyJWT, booksController.postBook)

router.route('/:id')
    .get(booksController.getBookById)
    .delete(verifyJWT, booksController.deleteBook)
    .patch(verifyJWT, booksController.patchBook)

router.route('/added-by/:id')
    .get(verifyJWT, booksController.getBooksByUser)

module.exports = router