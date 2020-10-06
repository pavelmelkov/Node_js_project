const {body} = require('express-validator')
const User = require('../models/user')
exports.registerValidators = [
    body('email').isEmail()
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
    .trim()
]
exports.registerValidators = [
    
]
exports.courseValidators = [
    body('title_strat').isLength({min: 3}).withMessage('Min length of name is 3 symbols'),
    body('price_strat').isNumeric().withMessage('Введите корректную цену'),
    body('img_strat', 'Введите корректный Url картинки').isURL()
]