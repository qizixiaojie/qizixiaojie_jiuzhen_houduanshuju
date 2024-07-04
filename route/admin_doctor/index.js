//引入express
const express = require('express')
//引入admin_ospital的处理函数
const admin_doctor = require('./admin/index.js')
//创建router对象
const router = express.Router()

//添加医生数据
router.post('/doctor_add', admin_doctor.doctor_add)
//获取医生数据
router.get('/doctor_getList', admin_doctor.doctor_getList)
//删除医生信息
router.post('/doctor_delete', admin_doctor.doctor_delete)


module.exports = router