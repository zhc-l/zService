var express = require('express')
const http = require('http')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {

  let dataList = [
    {
      color: '#2563eb',
      name: 'primary1',
      desc: '主色1',
      id: 1
    },
    {
      color: '#598EF3',
      name: 'primary2',
      desc: '主色2',
      id: 2
    },
    {
      color: '#D3E6FE',
      name: 'primary3',
      desc: '主色3',
      id: 3
    },
    {
      color: '#d946ef',
      name: 'accent1',
      desc: '强调色1',
      id: 4
    },
    {
      color: '#fae8ff',
      name: 'accent2',
      desc: '强调色2',
      id: 5
    },
    {
      color: '#cbd5e1',
      name: 'text1',
      desc: '文本色1',
      id: 6
    },
    {
      color: '#94a3b8',
      name: 'text2',
      desc: '文本色2',
      id: 7
    },
    {
      color: '#1e293b',
      name: 'bg1',
      desc: '背景色1',
      id: 8
    },
    {
      color: '#334155',
      name: 'bg2',
      desc: '背景色2',
      id: 9
    },
    {
      color: '#475569',
      name: 'bg3',
      desc: '背景色3',
      id: 10
    }
  ]

  res.send({
    code: 200,
    msg: '请求成功',
    data: dataList
  })
  
})

module.exports = router
