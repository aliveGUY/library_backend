const Book = require('../models/Book')
const User = require('../models/User')
const asyncHander = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHander(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

const getUserById = asyncHander(async (req, res) => {
    const { id } = req.params
})

const register = asyncHander(async (req, res) => {
    const { username, password, roles } = req.body
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPwd, roles }

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: `Invalid user data recieved` })
    }
})

const deleteUser = asyncHander(async (req, res) => {
    const { id } = req.params

    const book = await Book.findOne({ user: id }).lean().exec()
    if (book) {
        return res.status(400).json({ message: 'User has assigned books' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

const patchUser = asyncHander(async (req, res) => {
    const { username, password, roles } = req.body
    const { id } = req.params

    if (!username || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById({ _id: id }).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

module.exports = {
    getAllUsers,
    getUserById,
    register,
    deleteUser,
    patchUser
}