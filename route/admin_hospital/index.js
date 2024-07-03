//引入express
const express = require('express')
//引入admin_ospital的处理函数
const admin_hospital = require('./admin/index')
//创建router对象
const router = express.Router()

router.post('/hospital_add',admin_hospital.hospital_add)
module.exports = router