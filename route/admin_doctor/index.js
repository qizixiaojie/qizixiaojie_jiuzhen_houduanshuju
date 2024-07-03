//引入express
const express = require('express')
//引入admin_ospital的处理函数
const admin_doctor = require('./admin/index.js')
//创建router对象
const router = express.Router()

//添加医生数据
router.post('/doctor_add', admin_doctor.doctor_add)

module.exports = router