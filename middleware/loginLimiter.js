const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, please try again after 60 second pause'
    },
    handler: (req, res, next, options) => {
        console.log('Too many requests')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = loginLimiter