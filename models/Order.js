const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orderSchema = new mongoose.Schema(
    {
        order: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Book',
            default: []
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        purchased: {
            type: Boolean,
            default: false
        }
    }
)

orderSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Order', orderSchema)