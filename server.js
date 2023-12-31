require('dotenv').config()
require('express-async-errors')
const express = require("express");
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
connectDB()

// middleware
app.use(logger)
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use('/', express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/auth'))
app.use('/books', require('./routes/books'))
app.use('/users', require('./routes/users'))
app.use('/cart', require('./routes/cart'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// connect to db and listen
mongoose.connection.once('open', () => {
    app.listen(PORT, () =>
        console.log(`DB Connected\nPort Number: ${PORT}`)
    )
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
