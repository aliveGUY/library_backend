const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const cartController = require('../controllers/cart')
const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .get(cartController.getCart)
    .patch(cartController.updateCart)

module.exports = router