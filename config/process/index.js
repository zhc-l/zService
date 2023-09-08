
const jsonKey = {
    message:{
        ALIBABA_CLOUD_ACCESS_KEY_ID: 'LTAI5tHE2avbJNmzT1Csmk1L',
        ALIBABA_CLOUD_ACCESS_KEY_SECRET: '214MSerQlLKFuA9xqB0ti9vW0jhFGt',
    },
    jwt:{
        JWT_SECRET_KEY : 'gfg_jwt_secret_key',
        TOKEN_HEADER_KEY : 'gfg_token_header_key',
        JWT_DATE : 60*60,
    }
}

module.exports = () => {
    // 注入环境变量
    for (let key in jsonKey) {
        for (let item in jsonKey[key]) {
            process.env[item] = jsonKey[key][item]
        }
    }
}