const express = require('express')                  // 1 подключаем в начале
const cookieParser = require('cookie-parser')       // 1
const app = express()                               // 1
global.bodyParser = require('body-parser');         // 1
const csrf = require('csurf') // для защиты роутов  //
const flash = require('connect-flash') // оповещения //
// пути
const path = require('path')    // 1
const fs = require('fs')        //
const compression = require('compression')  // 
const helmet = require('helmet')            // 

const exphbs = require('express-handlebars') // 1 для роутинга

// сессиии
const session = require('express-session')  //
// соединение с монго
const MongoStore = require('connect-mongodb-session')(session)  //
const userMiddleware = require('./middleware/user')             //

// подключение роутов
const addRoute = require('./routes/add')
const blogRoute = require('./routes/blog')
const calcRoute = require('./routes/calc')
const homeRoute = require('./routes/home')
const cardRoute = require('./routes/card')
const ordersRoute = require('./routes/orders')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const keys = require('./keys/index')
const User = require('./models/user')

const errorHandler = require('./middleware/error') 
const bcrypt = require('bcryptjs')

const fileMiddleware = require('./middleware/file')
// middlewar сессии
const varMid = require('./middleware/variables')

app.use(cookieParser())

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})


// передача в запрос данных пользователя
app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5f2fd04556514440809cb394')
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
})


app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static(path.join(__dirname, 'quiz')));
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 100000
  }))
  app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 100000
  }))

// подключение и настройка сессий 
// создаёт req.session - позволяет хранить данные внутри сессии
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))// подключение загрузки одного файла
// подключение middleware сессии
// app.use(csrf());
app.use(varMid)
app.use(userMiddleware)
app.use(flash())
// app.use(helmet()) // не работает
app.use(compression())
// запуск роутов
app.use('/auth', authRoutes)
app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/blog', blogRoute)
app.use('/calc', calcRoute)
app.use('/card', cardRoute)
app.use('/orders', ordersRoute)

app.use(errorHandler)


//handlebar
const hbs = exphbs.create({
    defaultLayout: 'main', // опция - основной layout
    extname: 'hbs', // чтобы файлам писать расширения hbs вместо handlebars
    helpers: require('./utils/hbs-helper')
})
app.engine('hbs', hbs.engine)
// 
app.set('view engine', 'hbs') // подключаем и используем handlebars
app.set('views', 'views') // папка с шаблонами (второй аргумент)



// передача локальных данных на запрос как объект
app.use(function (req, res, next) {
    if (req.user) {
      res.locals.user = req.user.toObject();
    }
    next();
  });

// import React from 'react';
// import {render} from 'react-dom';

// render (
//      <div> aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa </div>
//     ,document.getElementById('root')
// );

// запуск 
PORT = process.env.PORT || 3000
async function start() {
    try {
    await mongoose.connect(keys.MONGODB_URI, {
        useNewUrlParser: true,
        useFindAndModify:false,
        useUnifiedTopology: true
    })
    // создать временного пользователя
    // const candidate = await User.findOne()
    // if (!candidate) {
    //     const user = new User({
    //         email: 'house.melkov@gmail.com',
    //         name: 'Pavel',
    //         cart: {items: []},
            
    //     })
    //     await user.save()
    // }
    app.listen(PORT, () => {
        console.log(`Srever is running on port ${PORT}`)
    })
        } catch(e) {
            console.log(e)
    }   
}
start()