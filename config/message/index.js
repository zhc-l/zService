const Core = require('@alicloud/pop-core');

var client = new Core({
  // Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
  accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
  accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
  // securityToken: process.env['ALIBABA_CLOUD_SECURITY_TOKEN'], // use STS Token
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

// 获取签名列表
exports.getSignList = async function () {
    var params = {
        "PageSize": 10,
        "PageIndex": 1
    }
    var requestOption = {
        method: 'POST',
        formatParams: false,
    };
    return client.request('QuerySmsSignList', params, requestOption)
}
// 发送消息
exports.sendSms = async function (phone, code) {
    var params = {
        "PhoneNumbers": phone,
        "SignName": "周浩臣的个人网站",
        "TemplateCode": "SMS_462460341",
        "TemplateParam": "{\"code\":\"" + code + "\"}"
    }
    
    var requestOption = {
        method: 'POST',
        formatParams: false,
    };
    
    return client.request('SendSms', params, requestOption)
}