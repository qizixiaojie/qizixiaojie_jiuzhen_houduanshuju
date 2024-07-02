const db = require('../../db/index')
var jwt = require('jsonwebtoken')
const user = {
  //用户注册
  userRegister: (req, res) => {
    const { userName, passWord } = req.body

    if (!userName || !passWord) {
      res.status(400).json({
        success: false,
        message: '用户名和密码为必传参数...'
      })
      return
    }

    const checkUserQuery = 'SELECT * FROM user WHERE userName = ?'
    db.query(checkUserQuery, [userName], (err, results) => {
      if (err) {
        console.error('Error checking user:', err)
        res.status(500).json({
          success: false,
          message: '内部服务器错误'
        })
        return
      }

      if (results.length >= 1) {
        res.json({
          success: false,
          message: '注册失败，用户名重复'
        })
      } else {
        const insertUserQuery = 'INSERT INTO user (userName, passWord) VALUES (?, ?)'
        db.query(insertUserQuery, [userName, passWord], (err, results) => {
          if (err) {
            console.error('Error inserting user:', err)
            res.status(500).json({
              success: false,
              message: '内部服务器错误'
            })
            return
          }

          if (results.affectedRows === 1) {
            res.json({
              code: 200,
              success: true,
              message: '注册成功'
            })
          } else {
            res.json({
              success: false,
              message: '注册失败'
            })
          }
        })
      }
    })
  },
  //用户登入
  userLogin: (req, res) => {
    const { userName, passWord } = req.body
    console.log(userName, passWord)

    if (!userName || !passWord) {
      return res.status(400).json({
        code: 0,
        msg: '用户名和密码为必传参数...'
      })
    }

    // 查询用户信息
    const sqlStr = 'SELECT * FROM user WHERE userName = ?'
    db.query(sqlStr, [userName], (err, results) => {
      if (err) {
        console.error('Error querying user:', err)
        return res.status(500).json({
          code: 0,
          msg: '内部服务器错误'
        })
      }

      if (results.length === 0) {
        return res.json({ code: 0, msg: '用户不存在' })
      }

      const user = results[0]

      //比较密码
      if (passWord !== user.passWord) {
        return res.json({ code: 0, msg: '密码错误' })
      } else {
        const token = jwt.sign({ userName: user.userName }, 'secret', { expiresIn: '1h' })
        res.json({
          code: 200,
          msg: '登录成功',
          data: {
            userName: userName,
            token: token
          }
        })
      }
    })
  },
  //忘记密码
  userLogout: async (req, res) => {
    console.log(req.body)
    const { userName, newPassword } = req.body

    if (!userName || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '用户名和新密码为必传参数...'
      })
    }

    try {
      // 查询用户是否存在
      const findUserQuery = 'SELECT * FROM user WHERE userName = ?'
      const user = await db.query(findUserQuery, [userName])

      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }

      // 更新用户密码
      const hashedPassword = newPassword // 使用 bcrypt 对新密码进行哈希加密
      const updatePasswordQuery = 'UPDATE user SET passWord = ? WHERE userName = ?'
      await db.query(updatePasswordQuery, [hashedPassword, userName])

      res.json({
        code: 200,
        success: true,
        message: '密码更新成功'
      })
    } catch (error) {
      console.error('Error updating password:', error)
      res.status(500).json({
        success: false,
        message: '内部服务器错误'
      })
    }
  },
  // 将获取过来的数据推送到数据库存储
  userOrder: (req, res) => {
    console.log(req.body)
    const { username, IDcard, Realname, phone, money, isPay, doctor, date, hosname, sub_depname, M_or_A } = req.body.data

    const sql = `INSERT INTO user_order (username, IDcard, Realname, phone, money, isPay, doctor, date, hosname, sub_depname,M_or_A) VALUES (?,?,?,?,?,?,?,?,?,?,?)`

    db.query(sql, [username, IDcard, Realname, phone, money, isPay, doctor, date, hosname, sub_depname, M_or_A], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err)
        res.status(500).send('Internal Server Error')
        return
      }
      if (M_or_A === '上午') {
        const sql1 = `SELECT doctorID FROM hospital_doctor WHERE name =?`
        db.query(sql1, [doctor], (err, result) => {
          if (err) {
            console.log('获取 id 错误')
            return
          } else {
            const doctorID = result[0].doctorID
            // 减去它这那一周上午的值
            const sql2 = `UPDATE hospital_doctor_time SET morningCount = morningCount - 1 WHERE doctorID =? AND toDay =?`
            db.query(sql2, [doctorID, date], (err, result) => {
              if (err) {
                console.log('减少上午失败')
              } else {
                console.log('减少上午成功')
              }
            })
          }
        })
      } else if (M_or_A === '下午') {
        const sql3 = `SELECT doctorID FROM hospital_doctor WHERE name =?`
        db.query(sql3, [doctor], (err, result) => {
          if (err) {
            console.log('获取下午 id 错误')
            return
          } else {
            const doctorID = result[0].doctorID
            // 减去它这那一周下午的值
            const sql4 = `UPDATE hospital_doctor_time SET afternoonCount = afternoonCount - 1 WHERE doctorID =? AND toDay =?`
            db.query(sql4, [doctorID, date], (err, result) => {
              if (err) {
                console.log('减少下午失败')
              } else {
                console.log('减少下午成功')
              }
            })
          }
        })
      }
      res.json({
        code: 200,
        success: true,
        message: '订单添加成功'
      })
    })
  },
  userGetOrder: (req, res) => {
    const { username } = req.body

    const sql = `SELECT * FROM user_order WHERE username =?`

    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error querying data:', err)
        res.status(500).send('Internal Server Error')
        return
      }
      res.send(results)
    })
  },
  userCancelOrder: (req, res) => {
    const { user_orderID } = req.body
    console.log(req.body)
    const sql = `DELETE FROM user_order WHERE user_orderID =?`

    db.query(sql, [user_orderID], (err, result) => {
      if (err) {
        console.error('删除订单出错:', err)
        res.status(500).send('服务器内部错误')
        return
      }
      if (result.affectedRows === 0) {
        res.status(404).send('未找到订单')
        return
      }
      res.send('订单取消成功')
    })
  }
}
module.exports = user
