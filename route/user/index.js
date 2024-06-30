//引入express
const express = require('express')
//引入hospital的处理函数
const hospital = require('./admin/index.js')
//创建router对象
const router = express.Router()

//用户注册
router.get('', hospital.hospitalCard)