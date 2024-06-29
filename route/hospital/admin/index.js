const db = require('../../db/index')
const hospital = {
  //获取分页列表数据
  hospitalCard: async (req, res) => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(req.params) // 打印请求参数以便调试

    try {
      const pageSize = parseInt(req.params.pageSize || 10)
      const page = parseInt(req.params.page, 10)
      const hostype = req.params.hostype && req.params.hostype !== "''" ? req.params.hostype : null
      const address = req.params.address && req.params.address !== "''" ? decodeURIComponent(req.params.address) : null

      // 验证页码是否为正整数
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ code: 400, message: 'Invalid page number' })
      }

      const offset = (page - 1) * pageSize

      let query = 'SELECT * FROM HOSPITAL WHERE 1=1'
      let queryParams = []

      if (hostype) {
        query += ' AND hostype = ?'
        queryParams.push(hostype)
      }

      if (address) {
        query += ' AND address = ?'
        queryParams.push(address)
      }

      query += ' LIMIT ? OFFSET ?'
      queryParams.push(pageSize, offset)

      console.log('Executing query:', query) // 打印 SQL 查询语句以便调试
      console.log('With parameters:', queryParams) // 打印 SQL 查询参数以便调试

      db.query(query, queryParams, (error, result, fields) => {
        if (error) {
          console.error('Database query error:', error) // 打印数据库查询错误以便调试
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }

        res.json({
          code: 200,
          message: 'Ok',
          data: result,
          total: result.length, // 这里只是示例，通常你需要另一个查询来获取总记录数
          page: page,
          pageSize: pageSize
        })
      })
    } catch (err) {
      console.error('Error fetching hospital data:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  },
  gardeCard: async (req, res) => {
    try {
      // 获取 grade 参数
      const grade = req.params.grade
      console.log(grade)

      // 构建查询语句，根据 grade 进行筛选
      const query = `SELECT * FROM HOSPITAL WHERE hostype =? `
      db.query(query, grade, (error, result, fields) => {
        if (error) {
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }

        // 如果结果少于 pageSize，则表明这是最后一页且可能数据不足
        res.json({
          code: 200, // 成功状态码
          message: 'Ok', // 成功消息
          data: result, // 返回的数据
          total: result.length // 这里只是示例，通常你需要另一个查询来获取总记录数
        })
      })
    } catch (err) {
      console.error('Error fetching hospital data:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  },
  gradeClassify: async (req, res) => {
    try {
      // 构建查询语句，获取不同的 hostype 种类
      const query = `SELECT DISTINCT hostype FROM HOSPITAL`
      db.query(query, (error, result, fields) => {
        if (error) {
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }

        res.json({
          code: 200,
          message: 'Ok',
          data: result.map(item => item.hostype)
        })
      })
    } catch (err) {
      console.error('Error fetching hospital data:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  },
  regionClassify: async (req, res) => {
    try {
      // 构建查询语句，获取不同的 hostype 种类
      const query = `SELECT DISTINCT address FROM HOSPITAL`
      db.query(query, (error, result, fields) => {
        if (error) {
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }

        res.json({
          code: 200,
          message: 'Ok',
          data: result.map(item => item.address)
        })
      })
    } catch (err) {
      console.error('Error fetching hospital data:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  }
}
module.exports = hospital
