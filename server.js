require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const app = express()
const connectDB = require('./config/dbConn')

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/auth', require('./routes/auth'))
app.use('/books', require('./routes/books'))
app.use('/users', require('./routes/users'))
app.get('/', (req, res) => { res.json({ mssg: "welcome to the app" }) })

// connect to db and listen
connectDB()
mongoose.connection.once('open', () => {
    app.listen(process.env.PORT, () =>
        console.log(`DB Connected\nPort Number: ${process.env.PORT}`)
    )
})

