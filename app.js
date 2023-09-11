let processKey = require('./config/process/index')
processKey() // 注入环境变量

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const { jwtAuthExclued } = require('./config/jwt/index') // jwt验证中间件

//注意要放到注册路由之前
const session = require('express-session')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
const theme = require('./routes/theme')
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// 使用express-session 来存放数据到session中
app.use(
  session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 }
  })
)

// jwt 验证
app.use(jwtAuthExclued)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/theme', theme)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, providing error to the view engine
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
