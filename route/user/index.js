//引入express
const express = require('express')
//引入hospital的处理函数
const user = require('./admin/index.js')
//创建router对象
const router = express.Router()

//用户注册
router.post('/register', user.userRegister)
//用户登录
router.post('/login', user.userLogin)
//用户忘记密码
router.post('/logout', user.userLogout)
//用户推送订单
router.post('/order', user.userOrder)
//获取订单数据
router.post('/getorder',user.userGetOrder)
//删除订单数据
router.post('/cancel_order',user.userCancelOrder)
module.exports = router
