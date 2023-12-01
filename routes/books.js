const express = require('express')
const router = express.Router()

const {
    getAllBooks,
    getBookById,
    postBook,
    deleteBook,
    patchBook
} = require('../controllers/books')

router
    .get('/', getAllBooks)
    .post('/', postBook)
    .get('/:id', getBookById)
    .delete('/:id', deleteBook)
    .patch('/:id', patchBook)

module.exports = router