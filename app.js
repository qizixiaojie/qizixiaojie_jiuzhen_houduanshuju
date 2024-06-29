const express = require('express')
const app = express()
const hospital = require('./route/hospital/index')
const cors = require('cors')
//监听3000端口
const PORT = 8080
//配置跨域请求
app.use(cors())

// 导入医院相关的数据
// 监听GET请求到'/'路径
app.use('/', hospital)
app.use('/hospital', hospital)

// 开始监听指定端口

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
