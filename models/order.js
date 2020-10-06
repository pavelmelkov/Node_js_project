const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
    strats: [
        {
        title_strat: {
            type: String
            
            },
        count: {
            type: Number,
            required: true
        },
        price_strat: {
            type: Number
        }
    }
],
    user: { 
        name: String,
        email: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    pay: {
        type: Boolean,
    }
})

module.exports = model('Order', orderSchema)