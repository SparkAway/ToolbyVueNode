const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./router/user');
const joi = require('joi');
const bodyPaser = require('body-parser');
// 导入配置文件
const config = require('./config');
// 解析 token 的中间件
const expressJWT = require('express-jwt');
const { json } = require('express');
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req,res,next){
    res.cc = function(err,status=0){
        res.send({
            status:status,
            message:err instanceof Error?err.message:err
        })
    }
    next();
})

//跨域请求
app.use(cors());
app.use('/api',router);



// 错误中间件
app.use(function(err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 未知错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)
})


app.listen(4000,()=>{
    console.log('server running at 127.0.0.1:4000');
})