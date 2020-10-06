const {Router} = require('express')
const router = Router()
const Post = require('../models/post')
const Strategy = require('../models/strategy')
const auth = require('../middleware/auth')
const User = require('../models/user')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const parseForm = bodyParser.urlencoded({ extended: false })
const csrf = require('csurf') // для защиты роутов
const csrfProtection = csrf({ cookie: true })



router.get('/', csrfProtection, async (req, res) => {
    if (req.session.isAuthenticated) {
        const userId = req.session.user._id
        // console.log('userId:  ',userId)
        const user_profile = await User.findOne( { "_id": userId } ).lean()
        const all_strats = await Strategy.find().lean()
        // console.log('Все стратегии: ', all_strats)
        const strats_profile = all_strats.filter(c => c.userId.toString() === userId.toString())
     
        const posts = await Post.find()
        .populate('userId', 'email name')
        .select('descr_post title_post img_post text_post')
        .lean()
        
        const strats = await Strategy.find()
        .populate('userId', 'email name')
        .select('price_strat title_strat img_strat risk profit type_of_risk')
        .lean()
        
        
        res.render('blog', { // c помощью hbs можно написать, какую страницу рендерить 
            title: 'Блог',
            isBlog: true,
            posts,
            userId: req.session.user ? req.session.user._id.toString() : null,
            strats,
            user_profile,
            strats_profile,
            csrf: req.csrfToken(),
        })
    } else {
        const posts = await Post.find()
            .populate('userId', 'email name')
            .select('descr_post title_post img_post text_post')
            .lean()

        const strats = await Strategy.find()
            .populate('userId', 'email name')
            .select('price_strat title_strat img_strat risk profit type_of_risk')
            .lean()

        res.render('blog', { // c помощью hbs можно написать, какую страницу рендерить 
            title: 'Блог',
            isBlog: true,
            posts,
            strats
        })
    }
})



router.get('/post/:id/edit' , csrfProtection, auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const post = await Post.findById(req.params.id).lean()
    
    res.render('post-edit', {
        title: `Редактировать курс ${post.title}`,
        post,
        csrf: req.csrfToken()
    })
})

router.get('/strat/:id/edit' , auth, csrfProtection ,async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const strat = await Strategy.findById(req.params.id).lean()
    
    res.render('strat-edit', {
        title: `Редактировать курс ${strat.title}`,
        strat,
        csrf: req.csrfToken(),
    })
})

router.post('/strat/edit', auth, csrfProtection, async (req, res) => {
    const {id} = req.body
 
    try {
        delete req.body.id
        await Strategy.findByIdAndUpdate(id, req.body).lean()
        res.redirect('/blog')
    } catch(error) {
        console.log(error)
    }
})



router.post('/post/edit', auth, csrfProtection, parseForm, async (req, res) => {
    const {id} = req.body

    try {
        delete req.body.id
        await Post.findByIdAndUpdate(id, req.body).lean()
        res.redirect('/blog')
    } catch(error) {
        console.log(error)
    }
})


router.get('/strat/:id', csrfProtection, async (req, res) => {
    
    const strate = await Strategy.findById(req.params.id)
    const new_raiting = strate.raiting + 1
    await Strategy.findByIdAndUpdate(req.params.id, {raiting: new_raiting})
    const strat = await Strategy.findById(req.params.id).lean()
    
    res.render('strat', {
        layout: 'empty',
        title: `Обзор стратегии "${strat.title_strat}"`,
        strat,
        csrf: req.csrfToken(),
        })
})
router.post('/post/remove', auth, csrfProtection, parseForm, async (req, res) => {
    try {
        await Post.deleteOne({
            _id: req.body.id,
        }).lean()
       
        res.redirect('/blog')
    } catch (error) {
        console.log(error)
    }
})

router.post('/strat/remove', auth, csrfProtection, parseForm, async (req, res) => {
    try { 
        await User.update(
            {}, 
            { $pull: {"items": {"stratId" : req.body.id }}},
            {multi: true}
            )
        // await req.user.removeStrat(req.body.id)
        await Strategy.deleteOne({
            _id: req.body.id,
        }).lean()
       
        // await User.cart.items.deleteOne( { "_id": userId } )
        
        res.redirect('/blog')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router