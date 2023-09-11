var express = require('express')
const jwt = require('jsonwebtoken')
var router = express.Router()
const { sendSms } = require('../config/message/index')
const promisePool = require('../config/db/index')
const { getJwtToken } = require('../config/jwt/index')

/**
 * @api {post} /users/login 登录
 * @apiDescription 登录
 * @apiName login
 * @apiGroup users
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "code": 200,
 * "msg": "登录成功",
 * "data": {}
 * }
 * 
 */
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

/**
 * @api {post} /users/loginBySms 短信登录
 * @apiDescription 短信登录
 * @apiName loginBySms
 * @apiGroup users
 * @apiParam {String} mobile 手机号
 * @apiParam {String} captcha 验证码
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "登录成功",
 * "data": {}
 * }
 */
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
/**
 * @api {post} /users/forgetPassword 忘记密码 手机号找回
 * @apiDescription 忘记密码 手机号找回
 * @apiName forgetPassword
 * @apiGroup users
 * @apiParam {String} mobile 手机号
 * @apiParam {String} captcha 验证码
 * @apiParam {String} password 新密码
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "修改成功",
 * "data": {}
 * }
 */
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
/**
 * @api {post} /users/register 注册
 * @apiDescription 注册
 * @apiName register
 * @apiGroup users
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} createdDate 创建时间
 * @apiParam {String} mobile 手机号
 * @apiParam {String} email 邮箱
 * @apiParam {String} captcha 验证码
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "注册成功",
 * "data": {}
 * }
 */
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

/**
 * @api {post} /users/sendSms 发送短信
 * @apiDescription 发送短信
 * @apiName sendSms
 * @apiGroup users
 * @apiParam {String} mobile 手机号
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "发送成功",
 * "data": {}
 * }
 */
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

/**
 * @api {post} /users/verifySms 验证短信（一般不需要调用）
 * @apiDescription 验证短信
 * @apiName verifySms
 * @apiGroup users
 * @apiParam {String} captcha 验证码
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "验证成功",
 * "data": {}
 * }
 */
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
