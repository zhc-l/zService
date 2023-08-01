process.env.JWT_SECRET_KEY = 'gfg_jwt_secret_key'
process.env.TOKEN_HEADER_KEY = 'gfg_token_header_key'
process.env.JWT_DATE = '24h'

process.env.JWT_UNLESS_PATH = [
    '/users/login',
    '/users/register'
]


const { expressjwt:jwt } = require('express-jwt')
// 封装expressjwt校验、忽略接口单独搞出来方便后期维护、并返回给前端错误信息。封装的目的为了减少app.js中的代码量 最后导出在app.js中使用
module.exports = {
    jwt: jwt({
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ['HS256'],
        getToken: (req) => {
            if (req.headers[process.env.TOKEN_HEADER_KEY]) {
                return req.headers[process.env.TOKEN_HEADER_KEY]
            } else if (req.query && req.query.token) {
                return req.query.token
            }
            return null
        }
    }).unless({
        path: process.env.JWT_UNLESS_PATH
    }),
    jwtErrorHandler: (err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send({
                code: 401,
                msg: 'token无效',
                data: null
            })
        }
    }
}