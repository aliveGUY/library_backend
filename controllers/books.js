const Book = require('../models/Book')
const mongoose = require('mongoose')

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

    if (!books) {
        return res.status(404).json({ error: "no books found" })
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

const deleteBook = async (req, res) => {
    const { id } = req.params
    let book

    if (mongoose.Types.ObjectId.isValid(id)) {
        book = await Book.findOneAndDelete({ _id: id })
    }

    if (!book) {
        return res.status(404).json({ error: "no such book" })
    }

    res.status(200).json(book)
}

const patchBook = async (req, res) => {
    const { id } = req.params
    let book

    if (mongoose.Types.ObjectId.isValid(id)) {
        book = await Book.findByIdAndUpdate({ _id: id }, { ...req.body })
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
    patchBook
}