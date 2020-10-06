const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Strategy = require('../models/strategy')

router.get('/', auth, async (req, res) => {

    const userId = req.session.user._id
    const user_profile = await User.findOne( { "_id": userId } ).lean()
    const all_strats = await Strategy.find().lean()
    const strats_profile = all_strats.filter(c => c.userId.toString() === userId.toString())

    res.render('calc', { // c помощью hbs можно написать, какую страницу рендерить 
        title: 'Калькулятор',
        isCalc: true,
        strats_profile,
        user_profile
    })
})



module.exports = router