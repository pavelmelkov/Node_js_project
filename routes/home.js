const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const Strategy = require('../models/strategy')
const auth = require('../middleware/auth')

const bodyParser = require('body-parser')
const parseForm = bodyParser.urlencoded({ extended: false })
const csrf = require('csurf') // для защиты роутов
const csrfProtection = csrf({ cookie: true })

// берем стратегии пользователя
router.get('/', csrfProtection, async (req, res) => {
    if (req.session.isAuthenticated) {
        const userId = req.session.user._id

        const user = await User.findOne( { "_id": userId } ).lean()
        const userQual = !user.qual
        const all_strats = await Strategy.find().lean()

        const strats = all_strats.filter(c => c.userId.toString() === userId.toString())
        sort_strats = all_strats
        sort_strats.sort(function (a, b) {
            if (a.raiting < b.raiting) {
              return 1;
            }
            if (a.raiting > b.raiting) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          });
          finally_sort_strats = []
          if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) === "object") && (typeof(sort_strats[2]) ==="object")) {
            for (i = 0; i < 3; i++) {
                finally_sort_strats.push(sort_strats[i])
            }
          } 
            if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) === "object") && (typeof(sort_strats[2]) != "object")) {
                for (i = 0; i < 2; i++) {
                    finally_sort_strats.push(sort_strats[i])
                }
              } 
                  if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) != "object")) {
                    finally_sort_strats.push(sort_strats[0])
                  }
          

        
        res.render('index', { // c помощью hbs можно написать, какую страницу рендерить 
            title: 'Главная страница',
            isHome: true,
            layout: 'main_index',
            userQual,
            user,
            strats,
            finally_sort_strats,
            csrf: req.csrfToken(),
            })
    }
     else 
    { 
     
        const all_strats = await Strategy.find().lean()
        sort_strats = all_strats
        sort_strats.sort(function (a, b) {
            if (a.raiting < b.raiting) {
              return 1;
            }
            if (a.raiting > b.raiting) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          });

        finally_sort_strats = []
          if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) === "object") && (typeof(sort_strats[2]) ==="object")) {
            for (i = 0; i < 3; i++) {
                finally_sort_strats.push(sort_strats[i])
            }
          } 
            if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) === "object") && (typeof(sort_strats[2]) != "object")) {
                for (i = 0; i < 2; i++) {
                    finally_sort_strats.push(sort_strats[i])
                }
              } 
                  if ((typeof(sort_strats[0]) === "object") && (typeof(sort_strats[1]) != "object")) {
                    finally_sort_strats.push(sort_strats[0])
                  }


        res.render('index', { // c помощью hbs можно написать, какую страницу рендерить 
            title: 'Главная страница',
            isHome: true,
            layout: 'main_index',
            finally_sort_strats,
            })
    }
})

router.post('/qual', auth, csrfProtection, parseForm, async (req, res) => {
    // const userId = req.session.user._id 
    // const user = await User.findOne({ "_id":userId }).lean()
    // res.status(200).json(user)
   
      const user = await User.findById(req.user._id)
  
        const toChange = {
            qual: req.body.qual
        }

        
        Object.assign(user, toChange)
        await user.save()
    
})
   


router.post('/edit_profile', auth, csrfProtection, parseForm, async (req, res) => {
  
    try {
      const user = await User.findById(req.user._id)
        const toChange = {
            name: req.body.name
        }
        
 
        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        
        res.redirect('/')
    } catch (error) {
      console.log(error)
    }
})


module.exports = router