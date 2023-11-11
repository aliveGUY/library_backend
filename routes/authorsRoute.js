const express = require('express')
const router = express.Router()
const authorController = require('../controllers/authorsController')

router.route('/')
    .get(authorController.getAllAuthors)
    .post(authorController.createNewAuthor)
    .patch(authorController.updateAuthor)
    .delete(authorController.deleteAuthor)

module.exports = router