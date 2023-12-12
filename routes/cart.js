const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const cartController = require('../controllers/cart')
const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .post(cartController.getCart)
    .patch(cartController.updateCart)

module.exports = router