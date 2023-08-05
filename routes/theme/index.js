var express = require('express')
const http = require('http')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({
    code: 200,
    msg: '请求成功',
    data: {
        primary1: '#2563eb',
        primary2: '#598EF3',
        primary3: '#D3E6FE',
        accent1: '#d946ef',
        accent2: '#fae8ff',
        text1: '#cbd5e1',
        text2: '#94a3b8',
        bg1: '#1e293b',
        bg2: '#334155',
        bg3: '#475569',
    }
  })
})

module.exports = router
