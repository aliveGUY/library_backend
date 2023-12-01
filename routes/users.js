const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const usersController = require('../controllers/users')
const router = express.Router()

router.route('/')
    .get(verifyJWT, usersController.getAllUsers)
    .post(usersController.register)

router.route('/:id')
    .get(usersController.getUserById)
    .delete(verifyJWT, usersController.deleteUser)
    .patch(verifyJWT, usersController.patchUser)

module.exports = router