const {Schema, model} = require('mongoose')
const user = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String,
    cart: 
        {
     items:
         [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                
                stratId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Strategy',
                    required: true
                }
            }
        ]
    },
    qual: {
        type: Boolean,
        required: true,
    },
    
})

user.methods.addToCart = function (strat) {
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.stratId.toString() === strat._id.toString()
    })
    if (idx >= 0) {
        clonedItems[idx].count += 1

    }else {
        clonedItems.push({
            stratId: strat._id,
            count: 1
        })
    }

    // const newCart = {items: clonedItems}
    // this.cart = newCart

    this.cart = {items: clonedItems}
    return this.save()
}   
user.methods.removeStrat = function(id) {
    let items = [...this.cart.items]
    
    const idx = items.findIndex(c => {
        return c.stratId.toString() === id.toString()
    })
    
    items = items.filter(c => c.stratId.toString() !== id.toString())

    this.cart = {items}
    return this.save()
}   

user.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}
user.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.stratId.toString() === id.toString()
    })
    if (items[idx].count === 1) {
         items = items.filter(c => c.stratId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}   

user.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}



const User = model('User', user)
module.exports = User