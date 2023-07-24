var express = require('express')
var router = express.Router()
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    name: 'John Doe',
    age: 30,
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '212-555-1212',
    version: '1.0.1',
  })
})

module.exports = router
