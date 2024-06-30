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
//根据医院名字放回数据
router.get('/hospital_name/:hosname', hospital.nameKey)
//根据传入的医院代号，获取医院详情信息
router.get('/hospital_detail/:hoscode', hospital.findDetail)
// //获取医院部门数据
router.get('/hospital_depart/departments', hospital.findDepartments)
module.exports = router
