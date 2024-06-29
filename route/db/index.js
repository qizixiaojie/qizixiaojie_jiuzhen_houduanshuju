//连接数据库
const mysql = require('mysql')
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: '柒子小姐就诊平台'
})
module.exports = db
