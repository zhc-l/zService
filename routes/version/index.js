var express = require('express')
const http = require('http')
var router = express.Router()

/* GET home page. */
/**
 * @api {get} /version 获取版本号
 * @apiDescription 获取版本号
 * @apiName version
 * @apiGroup version
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} msg 信息说明
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {json} Success-Response:
 * {
 * "code": 200,
 * "msg": "获取成功",
 * "data": {}
 * }
 */
router.get('/', function (req, res, next) {
  //  res.render('index', { title: 'Express' })
  // http.get('http://localhost:3000/api/version', resp => {
  //   console.log(resp)
  // })
  res.send('1.0.0')
})

module.exports = router
