require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose')
const booksRoutes = require('./routes/books')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const app = express()

// middleware
app.use(express.json())
app.use(cors(corsOptions))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/books', booksRoutes)
app.get('/', (req, res) => {
    res.json({ mssg: "welcome to the app" })
})

// connect to db
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        // listening
        app.listen(process.env.PORT, () => {
            console.log(`connected to db and listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })

