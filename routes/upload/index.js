var express = require('express')
var router = express.Router()
const promisePool = require('../../config/db/index')
/*      文件上传
    * 1. 上传文件的接口
    * 2. 获取文件地址的接口
    * 3. 删除文件的接口
    * 4. 文件下载的接口
    * 5. 文件预览的接口
    * 6. 文件重命名的接口
    * 7. 文件移动的接口
    * 8. 文件复制的接口
    * 9. 文件压缩的接口
    * 10. 文件解压的接口
    * 11. 文件加密的接口
    * 12. 文件解密的接口
    * 13. 文件加水印的接口
    * 14. 文件转换的接口
    * 15. 文件合并的接口
    * 16. 文件拆分的接口
*/
// 上传文件 formData 上传成功后返回http文件路径
router.post('/upload', function (req, res, next) {
    const { name, url, size, type } = req.body
    promisePool.query(`INSERT INTO upload (name,url,size,type) VALUES ('${name}','${url}','${size}','${type}')`).then(([rows, fields]) => {
        res.send({
            code: 200,
            msg: '上传成功',
            data: null
        })
    }).catch(err => {
        res.send({
            code: 400,
            msg: '上传失败',
            data: err
        })
    })
})

// 获取文件地址
router.get('/getUpload', function (req, res, next) {
    promisePool.query(`SELECT * FROM upload`).then(([rows, fields]) => {
        res.send({
            code: 200,
            msg: '获取成功',
            data: rows
        })
    }).catch(err => {
        res.send({
            code: 400,
            msg: '获取失败',
            data: err
        })
    })
})
// 删除文件
router.post('/deleteUpload', function (req, res, next) {
    const { id } = req.body
    promisePool.query(`DELETE FROM upload WHERE id='${id}'`).then(([rows, fields]) => {
        res.send({
            code: 200,
            msg: '删除成功',
            data: null
        })
    }).catch(err => {
        res.send({
            code: 400,
            msg: '删除失败',
            data: err
        })
    })
})
// 获取单个文件
router.post('/getUploadById', function (req, res, next) {
    const { id } = req.body
    promisePool.query(`SELECT * FROM upload WHERE id='${id}'`).then(([rows, fields]) => {
        res.send({
            code: 200,
            msg: '获取成功',
            data: rows
        })
    }).catch(err => {
        res.send({
            code: 400,
            msg: '获取失败',
            data: err
        })
    })
})





module.exports = router
