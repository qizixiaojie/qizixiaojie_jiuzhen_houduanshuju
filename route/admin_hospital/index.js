//引入express
const express = require('express')
//引入admin_ospital的处理函数
const admin_hospital = require('./admin/index')
//创建router对象
const router = express.Router()

//添加医院数据
router.post('/hospital_add', admin_hospital.hospital_add)
//获取医院数据列表
router.get('/hospital_getList', admin_hospital.hospital_getList)
//删除医院
router.get('/hospital_delete', admin_hospital.hospital_delete)
//修改医院信息
router.post('/hospital_update', admin_hospital.hospital_update)
module.exports = router