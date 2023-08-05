const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '116.62.114.25',
  user: 'Admin',
  password: '123456',
  database: 'USER_INFO',
});

const promisePool = pool.promise();

module.exports = promisePool;
