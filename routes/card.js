const {Router, json} = require('express')
const router = Router()
// const Card = require('../models/card')
const Strategy = require('../models/strategy')
const User = require('../models/user')
const auth = require('../middleware/auth')




function mapCartItems(cart) {
    const new_cart = cart.items.filter(c => c.stratId !== null)
    return new_cart.map(c => ({
            ...c.stratId.toJSON(),
            id: c.stratId.id, 
            count: c.count
        })
    )
}

function computerPrice(strats) {
    return strats.reduce((total, strat) => {
        return total += strat.price_strat * strat.count
    }, 0)
}


router.delete('/remove/:id', auth, async (req, res) => {

    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.stratId').execPopulate()
    const strats = mapCartItems(user.cart)

    const cart = {
        strats, price_strat: computerPrice(strats)
    }
    res.status(200).json(cart)
})

router.post('/add', auth,  async (req, res) => {
    const strat = await Strategy.findById(req.body.id)
    await req.user.addToCart(strat)
    res.redirect('/card')
})


router.get('/', auth,  async (req, res) => {

        const userId = req.session.user._id
        const user_profile = await User.findOne( { "_id": userId } ).lean()
        const all_strats = await Strategy.find().lean()
        const strats_profile = all_strats.filter(c => c.userId.toString() === userId.toString())

        const user = await req.user
        .populate('cart.items.stratId')
        .execPopulate()

        const strats = mapCartItems(user.cart) 
    
        res.render('card', {
            title: 'Корзина',
            isCard: true,
            strats: strats,
            price_strat: computerPrice(strats),
            strats_profile,
            user_profile,
          
            })
    
})


module.exports = router