const { expressjwt:jwt } = require('express-jwt')
// 封装expressjwt校验、忽略接口单独搞出来方便后期维护、并返回给前端错误信息。封装的目的为了减少app.js中的代码量 最后导出在app.js中使用
module.exports = {
    jwt: jwt({
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/api/login',
            '/api/register',
            '/api/version',
        ]
    }),
    // 错误处理
    jwtError: (err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send({
                code: 401,
                msg: 'token验证失败',
                data: null
            })
        }
    }
}