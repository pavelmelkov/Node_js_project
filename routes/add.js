const {Router} = require('express')
const router = Router()
const Post = require('../models/post')
const Strategy = require('../models/strategy')
const auth = require('../middleware/auth')
const User = require('../models/user')
const {courseValidators} = require('../utils/validators')
const {body} = require('express-validator')

const bodyParser = require('body-parser')
const parseForm = bodyParser.urlencoded({ extended: false })
const csrf = require('csurf') // для защиты роутов
const csrfProtection = csrf({ cookie: true })

router.get('/', auth, csrfProtection, async (req, res) => {
    if (req.session.isAuthenticated) {
        const userId = req.session.user._id

        const user_profile = await User.findOne( { "_id": userId } ).lean()
        const all_strats = await Strategy.find().lean()

        const strats_profile = all_strats.filter(c => c.userId.toString() === userId.toString())
        const addDisable = !user_profile.qual
        res.render('add', {
            title: 'Добавить',
            isAdd: true,
            user_profile,
            strats_profile,
            addDisable,
            csrf: req.csrfToken()
        })
    } 
})

router.post('/post', auth,  csrfProtection, parseForm, async (req, res) => {
    // с БД
    const post = new Post({
        title_post: req.body.title_post,
        descr_post: req.body.descr_post,
        text_post: req.body.text_post,
        img_post: req.body.img_post,
        userId: req.user._id
    })
    
    try {
        await post.save()
        res.redirect('/blog')
    } catch (e) {
        console.log(e)
    }
})

router.post('/strat', auth, csrfProtection, parseForm ,[body('title_strat').isLength({min: 3}).withMessage('Min length of name is 3 symbols'),
    body('price_strat').isNumeric().withMessage('Введите корректную цену'),
    body('img_strat', 'Введите корректный Url картинки').isURL()], async (req, res) => {

    // const strat = new Strategy(req.body.title_strats, req.body.text_strat,  req.body.price_strat, req.body.img_strat)
    // await strat.save()
    // res.redirect('/blog')

     // Валидация
    // const errors = validationResult(req)

    // if(!errors.isEmpty()) {
    //     return res.status(422).render('add', {
    //         title: 'Добавить курс',
    //         isAdd: true,
    //         error: errors.array()[0].msg,
    //         data: {
    //             title: req.body.title,
    //             price: req.body.price,
    //             img: req.body.img,
    //         }
    //     })
    // }

    // с БД
    
    const strategy = new Strategy({
        title_strat: req.body.title_strat,
        text_strat: req.body.text_strat,
        price_strat: req.body.price_strat,
        img_strat: req.body.img_strat,
        userId: req.user._id,
        risk: req.body.risk,
        profit: req.body.profit,
        type_of_risk: req.body.type_of_risk
    })
    
    try {
        await strategy.save()
        res.redirect('/blog')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router