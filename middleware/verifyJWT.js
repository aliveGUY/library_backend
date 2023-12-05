const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const cookies = req.cookies

  if (!cookies.jwt) {
    return res.status(401).json({ message: 'Unauthorized from verifyJWT' })
  }

  jwt.verify(
    cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden from verifyJWT' })
      req.id = decoded.id
      next()
    }
  )
}


module.exports = verifyJWT