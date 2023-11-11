const User = require('../models/User')
const Book = require('../models/Book')
const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all authors
// @route GET /authors
// @access Public
const getAllAuthors = asyncHandler(async (req, res) => {
    const authors = await User.find({ role: "Author" }).select('-password').lean().exec()
    if (!authors?.length) {
        return res.status(400).json({ message: 'No authors found' })
    }
    res.json(authors)
})

// @desc Create author
// @route POST /authors
// @access Public
const createNewAuthor = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body

    // Confirm data
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {
        username,
        password: hashedPwd,
        role
    }

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data recieved' })
    }
})

// @desc Update author
// @route PATCH /authors
// @access Private
const updateAuthor = asyncHandler(async (req, res) => {
    const { id, username, role, password } = req.body

    if (!id || !username || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }


    user.username = username
    user.role = role

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })

})

// @desc Delete author
// @route DELETE /authors
// @access Private
const deleteAuthor = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // const books = await Book.findOne({ author: id }).lean().exec()
    const order = await Book.findOne({ user: id }).lean().exec()

    if (order) {
        return res.status(400).json({ message: 'User has assigned order' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllAuthors,
    createNewAuthor,
    updateAuthor,
    deleteAuthor
}