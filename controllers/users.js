const Book = require('../models/Book')
const User = require('../models/User')
const Cart = require('../models/Cart')
const asyncHander = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const getAllUsers = asyncHander(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

const getUserById = asyncHander(async (req, res) => {
    const { id } = req.params
    let user

    if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id).select('-password').lean()
    }

    if (!user) {
        return res.status(404).json({ error: "no such user" })
    }

    res.status(200).json(user)
})

const register = asyncHander(async (req, res) => {
    const { username, password, avatar, about } = req.body
    if (!username || !password || !avatar) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {
        avatar,
        username,
        about,
        password: hashedPwd,
        roles: ["Customer"]
    }

    const user = await User.create(userObject)
    await Cart.create({ user: user._id })

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
    const { username, password, roles, avatar, about } = req.body
    const { id } = req.params

    if (!username || !avatar || !Array.isArray(roles) || !roles.length) {
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
    user.avatar = avatar
    user.about = about

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