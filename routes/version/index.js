var express = require('express')
const http = require('http')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  //  res.render('index', { title: 'Express' })
  // http.get('http://localhost:3000/api/version', resp => {
  //   console.log(resp)
  // })
  res.send('1.0.0')
})

module.exports = router