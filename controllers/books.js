const Book = require('../models/Book')
const mongoose = require('mongoose')
const asyncHander = require('express-async-handler')


const getAllBooks = async (req, res) => {
    const books = await Book.find().sort({ createdAt: -1 })
    res.status(200).json(books)
}

const getBookById = async (req, res) => {
    const { id } = req.params
    let book

    if (mongoose.Types.ObjectId.isValid(id)) {
        book = await Book.findById(id)
    }

    if (!book) {
        return res.status(404).json({ error: "no such book" })
    }

    res.status(200).json(book)
}

const getBooksByUser = async (req, res) => {
    const { id } = req.params
    let books

    if (mongoose.Types.ObjectId.isValid(id)) {
        books = await Book.find({ user: id }).lean().exec()
    }

    if (!books.length) {
        return res.status(404).json({ error: "no books found" })
    }

    res.status(200).json(books)
}

const getBooksSearchResults = async (req, res) => {
    const { query } = req.body

    const books = await Book.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { author: { $regex: query, $options: "i" } }
        ]
    })

    if (!books?.length) {
        return res.status(404).json({ error: "books not found" })
    }

    res.status(200).json(books)
}

const postBook = async (req, res) => {
    try {
        const book = await Book.create({ ...req.body })
        res.status(200).json(book)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const deleteBook = asyncHander(async (req, res) => {
    const { id } = req.params

    const book = await Book.findById(id).exec()

    if (!book) {
        return res.status(400).json({ message: 'Book not found' })
    }

    const result = await book.deleteOne()

    await Cart.updateMany({ cart: id }, { $pull: { cart: id } })

    const reply = `Book ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})

const patchBook = async (req, res) => {
    const { id } = req.params
    const { user, ...userless } = req.body // Book might be updated by Admin. I dont want to loose track of original creator
    let book

    if (mongoose.Types.ObjectId.isValid(id)) {
        book = await Book.findByIdAndUpdate({ _id: id }, { ...userless })
    }

    if (!book) {
        return res.status(404).json({ error: "no such book" })
    }

    res.status(200).json(book)
}

module.exports = {
    getAllBooks,
    getBookById,
    getBooksByUser,
    postBook,
    deleteBook,
    patchBook,
    getBooksSearchResults
}