//引入express
const express = require('express')
//引入hospital的处理函数
const hospital = require('./admin/index.js')
//创建router对象
const router = express.Router()

//获取医院卡片的数据
router.get('/hospital_data/:page/:pageSize/:hostype?/:address?', hospital.hospitalCard)
//获取医院等级分类的种类
router.get('/hospital_grade/classify', hospital.gradeClassify)
//获取医院地区等级分类的种类
router.get('/hospital_region/classify', hospital.regionClassify)
//获取医院等级数据
router.get('/hospital_grade/:grade', hospital.gardeCard)
module.exports = router
