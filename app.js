const express = require('express')
const app = express()
const hospital = require('./route/hospital/index')
const user = require('./route/user/index')
const cors = require('cors')

//这个组件用于接收post数据
const bodyParser = require('body-parser')

//监听3000端口
const PORT = 8080
//配置跨域请求
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// 导入医院相关的数据
// 监听GET请求到'/'路径
app.use('/', hospital)
app.use('/hospital', hospital)
app.use('/user', user)

// 用户登录相关
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 开始监听指定端口
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
