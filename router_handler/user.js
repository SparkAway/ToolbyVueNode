const db = require('../db/index');
//加密
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// 导入配置文件
const config = require('../config');

exports.regUser = (req,res)=>{
    const userinfo = req.body;
    if(!userinfo.password || !userinfo.username){
        return res.send({status:1,message:'用户名或密码名不能为空'});
    }
    const str = 'select * from users where username=?';
    db.query(str,[userinfo.username],function(err,result){
        if (err) {
            //   return res.send({ status: 1, message: err.message })
                return res.cc(err);
            }
        if(result.length>0){
            //   return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
                return res.cc('用户名被占用，选择其他用户名')
        }
        //第二个参数提高密码安全性
        userinfo.password =  bcrypt.hashSync(userinfo.password,10);
        const sql = 'insert into users set ?';
        db.query(sql,[{username:userinfo.username,password:userinfo.password}],(err,results)=>{
            if(err){
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！');
            }
            // 注册成功
            res.cc('注册成功',0);
        })
    })
}
exports.loginuser = (req,res)=>{
    const userinfo = req.body;
    const sql = 'select * from users where username = ?';
    db.query(sql,[userinfo.username],(err,results)=>{
        if(err)return res.cc(err);
        if (results.length !== 1) return res.cc('登录失败！')
        //判断密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if(!compareResult){
            return res.cc('登录失败');
        }
        //剔除密码
        const user = { ...results[0], password: ''};
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        })
        res.send({
            status: 1,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: tokenStr,
        })
    })
}