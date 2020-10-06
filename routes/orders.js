const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Strategy = require('../models/strategy')

const stripe = require('stripe')('sk_test_51HYrXKJTwv9il0JPk8stU3lgo5DuIALrMuze3M1UkEJzm1NO4B2HVwzYZlkeUKR2VRsgIwGZcQohkOupx1DLWGUk00GtjifhDj')

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.session.user._id
        const user_profile = await User.findOne( { "_id": userId } ).lean()
        const all_strats = await Strategy.find().lean()
        const strats_profile = all_strats.filter(c => c.userId.toString() === userId.toString())

        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId').lean()

       const modifyOrder = orders.map(o => {
        return {
            ...o,
            price_strat: o.strats.reduce((total, c) => {
                return total += c.count * c.price_strat
            }, 0)
        }
    })
        
        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: modifyOrder,
            user_profile,
            strats_profile
        })
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
        .populate('cart.items.stratId')
        .execPopulate()
    
    const strats = user.cart.items.map(i => (
        {
            count: i.count,
            title_strat: i.stratId.title_strat,
            price_strat: i.stratId.price_strat
        }
    ))

    const order = new Order({
        user: {
            name: req.user.name,
            email: req.user.email,
            userId: req.user
        },
        strats: strats
    })

    await order.save()
    await req.user.clearCart()


    res.redirect('/orders')
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/pay', auth, async (req, res) => {
    const amount = req.body.price_strat
    await Order.findByIdAndUpdate(req.body._id, {pay: true})
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
    }).then(
        customer => stripe.charges.create({
            amount,
            description: 'InvestBlog',
            currency: 'usd',
            customer: customer.id,
        })
    ).then( charge => res.render('success'))
})
module.exports = router