var express = require('express')
const jwt = require('jsonwebtoken')
var router = express.Router()
const { sendSms } = require('../config/message/index')
const promisePool = require('../config/db/index')
const { getJwtToken } = require('../config/jwt/index')

// 登陆
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  // username可能是用户名或者邮箱 password是密码
  promisePool.query(`SELECT * FROM users WHERE (username='${username}' OR mobile='${username}') OR email='${username}' AND password='${password}'`).then(([rows, fields]) => {
    if (rows.length > 0) {
      let data = {
        ...rows[0],
      }
      let token = getJwtToken(data)
      res.send({
        code: 200,
        msg: '登录成功',
        data: {
          token:token
        }
      })
    } else {
      // 判断是账号错误还是密码错误
      promisePool.query(`SELECT * FROM users WHERE username='${username}'`).then(([rows, fields]) => {
        if (rows.length > 0) {
          res.send({
            code: 400,
            msg: '密码错误',
            data: null
          })
        } else {
          res.send({
            code: 400,
            msg: '账号不存在',
            data: null
          })
        }
      }).catch(err => {
        res.send({
          code: 400,
          msg: '登录失败',
          data: err
        })
      })
    }
  }).catch(err => {
    console.log(err,'===')
    res.send({
      code: 400,
      msg: '登录失败',
      data: err
    })
  })
})

// 短信登陆
router.post('/loginBySms', function (req, res, next) {
  const { mobile, captcha } = req.body
  if (req.session.verificationCode === captcha) {
    promisePool.query(`SELECT * FROM users WHERE mobile='${mobile}'`).then(([rows, fields]) => {
      if (rows.length > 0) {
        let data = {
          ...rows[0],
        }
        let token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn: process.env.JWT_DATE})
        res.send({
          code: 200,
          msg: '登录成功',
          data: {
            token:token
          }
        })
      } else {
        res.send({
          code: 400,
          msg: '账号不存在',
          data: null
        })
      }
    }).catch(err => {
      res.send({
        code: 400,
        msg: '登录失败',
        data: err
      })
    })
  } else {
    res.send({
      code: 400,
      msg: '验证码错误',
      data: null
    })
  }
})

// 忘记密码 手机号找回
router.post('/forgetPassword', function (req, res, next) {
  const { mobile, captcha, password } = req.body
  if (req.session.verificationCode === captcha) {
    promisePool.query(`SELECT * FROM users WHERE mobile='${mobile}'`).then(([rows, fields]) => {
      if (rows.length > 0) {
        promisePool.query(`UPDATE users SET password='${password}' WHERE mobile='${mobile}'`).then(([rows, fields]) => {
          res.send({
            code: 200,
            msg: '修改成功',
            data: null
          })
        }).catch(err => {
          res.send({
            code: 400,
            msg: '修改失败',
            data: err
          })
        })
      } else {
        res.send({
          code: 400,
          msg: '账号不存在',
          data: null
        })
      }
    }).catch(err => {
      res.send({
        code: 400,
        msg: '修改失败',
        data: err
      })
    })
  } else {
    res.send({
      code: 400,
      msg: '验证码错误',
      data: null
    })
  }
})

// 注册
router.post('/register', function (req, res, next) {
  const { username, password, createdDate, mobile, email, captcha } = req.body
  if (req.session.verificationCode !== captcha) {
    res.send({
      code: 400,
      msg: '验证码错误',
      data: null
    })
    return;
  }
  promisePool.query(`SELECT * FROM users WHERE username='${username}' OR mobile='${mobile}' OR email='${email}'`).then(([rows, fields]) => {
    if (rows.length > 0) {
      // 判断是用户名还是手机号还是邮箱已经存在
      if (rows[0].username === username) {
        res.send({
          code: 400,
          msg: '用户名已经存在',
          data: null
        })
      }
      if (rows[0].mobile === mobile) {
        res.send({
          code: 400,
          msg: '手机号已经存在',
          data: null
        })
      }
      if (rows[0].email === email) {
        res.send({
          code: 400,
          msg: '邮箱已经存在',
          data: null
        })
      }
    } else {
      promisePool.query(`INSERT INTO users (username, password, created_date, mobile, email ) VALUES ('${username}', '${password}', '${createdDate}', '${mobile}', '${email}')`).then(([rows, fields]) => {
        res.send({
          code: 200,
          msg: '注册成功',
          data: null
        })
      }).catch(err => {
        res.send({
          code: 400,
          msg: '注册失败',
          data: err
        })
      })
    }
  }).catch(err => {
    res.send({
      code: 400,
      msg: '注册失败',
      data: err
    })
  })
})

// 发送短信
router.post('/sendSms', function (req, res, next) {
  const { mobile } = req.body
  if (!mobile) {
    res.send({
      code: 400,
      msg: '手机号不能为空',
      data: null
    })
  }
  // 6位随机验证码
  let code = Math.random().toString().slice(-6)
  sendSms(mobile, code).then((data) => {
    req.session.verificationCode = code 
    res.send({
      code: 200,
      msg: '发送成功',
      data: null
    })
  }).catch(err => {
    res.send({
      code: 400,
      msg: '发送失败',
      data: err
    })
  })
})

// 验证短信
router.post('/verifySms', function (req, res, next) {
  const { captcha } = req.body
  if (req.session.verificationCode === captcha) {
    req.session.destroy()
    res.send({
      code: 200,
      msg: '验证成功',
      data: null
    })
  } else {
    res.send({
      code: 400,
      msg: '验证失败',
      data: null
    })
  }
})

module.exports = router
