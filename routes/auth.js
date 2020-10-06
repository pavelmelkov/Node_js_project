const {Router, response} = require('express')
const router = Router()
const User = require('../models/user')

//криптография
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

//mailer
const nodemailer = require('nodemailer')
const regEmailer = require('../emails/registration')
const resetEmail = require('../emails/reset')

// ключи
const keys = require('../keys/index')


const { read } = require('fs')

// Валидации
const {registerValidators} = require('../utils/validators')
const {body, validationResult} = require('express-validator')

// скрипт мэйлера
const transporter = nodemailer.createTransport({
    // sendinblue({
    // auth: {api_key: keys.SENDGRID_API_KEY}})
    host: 'smtp.mail.ru',
    port: 587,
    auth: {
        user: 'pavelmelkov01@mail.ru',
        pass: 'O*SiroiyAP11'

    }
})

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
        if (err) {
            throw err
        }
        res.redirect('/')
        
    })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
            
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', [body('email').isEmail()
.withMessage('Введите корректный email')
.custom(async (value, {req}) => {
    try {
        const user = await User.findOne({email: value})
        if (user) {
            return Promise.reject('Такой email уже занят')
        }
    } catch (error) {
        console.log(error)
    }
})
.normalizeEmail(),
body('password', "Пароль должен содержать минимум 6 символов")
    .isLength({min: 6, max: 30})
    .isAlphanumeric()
    .trim(),
body('confirm').custom( (value, {req})=> {
    if( value !== req.body.password) {
        throw new Error('Password must be equil')
    }
return true
})
.trim(),
body('name')
.isLength({min: 3})
.withMessage('Name must consist min 3 simbols')
.trim()], async (req, res) => {
    try{
        const {email, password, confirm, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const candidate = await User.findOne({ email })
        if (!candidate) {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User ({
                email:email, 
                name: name, 
                password: hashPassword,
                cart: {items: []},
                qual: false,
            }) 

            await user.save()
            res.redirect('/auth/login#login')
            
            // отправка и-мэйл
            await transporter.sendMail(regEmailer(email), (err, info) => {
                if (err) return console.log(err)
                console.log('Email sent: ', info)
            })
        } else {
            req.flash('registerError', 'Такой пользователь уже есть')
            res.redirect('/auth/login#register')  
        }   
            
    } catch(e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (error, buffer) => {
            if (error) {
                req.flash('error', 'Что то пошло не так, повторите позже')
                res.redirect('/auth/reset')
            } else {
                const token = buffer.toString('hex')
                const candidate = await User.findOne({email: req.body.email})
                
                try{
                    if (candidate) {
                        candidate.resetToken = token
                        candidate.resetTokenExp = Date.now() + 60*60*1000
                        await candidate.save()
                        await transporter.sendMail(resetEmail(candidate.email, token))
                        res.redirect('/auth/login')
                    } else {
                        req.flash('error', 'Такой почты нет')
                        res.redirect('/auth/reset')
                    }
                }catch(error){
                    console.log('ошибка', error)
                }
             
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
       if (!user) {
           return res.redirect('/auth/login')
       } else {
        res.render('auth/password', {
            title: 'Restore access',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
       }
    } catch (error) {
        console.log(error)
    }
})


router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время восстановления истекло')
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error)
    }
}) 

module.exports = router