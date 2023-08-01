var express = require('express')
const jwt = require('jsonwebtoken')
var router = express.Router()
const promisePool = require('../db/index')

router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  promisePool.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}'`).then(([rows, fields]) => {
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
        msg: '登录失败',
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
})

router.post('/register', function (req, res, next) {
  const { username, password, createdDate } = req.body
  promisePool.query(`SELECT * FROM users WHERE username='${username}'`).then(([rows, fields]) => {
    if (rows.length > 0) {
      res.send({
        code: 400,
        msg: '用户名已存在',
        data: null
      })
    } else {
      promisePool.query(`INSERT INTO users (username, password, createdDate) VALUES ('${username}', '${password}', '${createdDate}')`).then(([rows, fields]) => {
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


module.exports = router
