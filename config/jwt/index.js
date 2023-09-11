// jwt token
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    token ? token.split('bearer ')[1] : null;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
}


const jwtSkipAuthList = ['/users/login','/users/loginBySms','/users/forgetPassword','/users/register','/users/sendSms','/users/verifySms','/theme']

module.exports.jwtAuthExclued = (req, res, next) => {
    if (jwtSkipAuthList.includes(req.path)) {
        next();
    } else {
        jwtAuth(req, res, next);
    }
}

module.exports.getJwtToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });
}