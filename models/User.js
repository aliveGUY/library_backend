const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  about: {
    type: String
  },
  roles: [{
    type: String,
    default: "Customer" // Customer Employee Admin Owner
  }],
})

module.exports = mongoose.model('User', userSchema)