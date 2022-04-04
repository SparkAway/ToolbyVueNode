const express = require('express');
const routerHandler = require('../router_handler/user');
const router = express.Router();

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')
//注册新用户
router.post('/Reguser',expressJoi(reg_login_schema),routerHandler.regUser);

//登录用户
router.post('/loginuser',expressJoi(reg_login_schema),routerHandler.loginuser);

//测试
router.get('/get',(req,res)=>{
    res.send('请求成功');
})
module.exports = router;