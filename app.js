const express = require('express')
const app = express()
const hospital = require('./route/hospital/index')
const user = require('./route/user/index')
const admin_hospital=require('./route/admin_hospital')
const cors = require('cors')

//这个组件用于接收post数据
const bodyParser = require('body-parser')

//监听3000端口
const PORT = 8080
//配置跨域请求
app.use(cors())
app.use(bodyParser.json())
// 增加请求大小限制

app.use(bodyParser.json({limit:'10000000mb'}));
app.use(bodyParser.urlencoded({limit:'10000000mb',extended:true}));




// 导入医院相关的数据
// 监听GET请求到'/'路径
app.use('/', hospital)
app.use('/hospital', hospital)
app.use('/user', user)
app.use('/admin_hospital', admin_hospital)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '')
  next()
})
app.get('/jokes/random', (req, res) => {
  request({ url: 'https://joke-api-strict-cors.appspot.com/jokes/random' }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: 'error', message: err.message })
    }

    res.json(JSON.parse(body))
  })
})
// 用户登录相关
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 开始监听指定端口
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
