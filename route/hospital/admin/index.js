const db = require('../../db/index')
const hospital = {
  //获取分页列表数据
  hospitalCard: async (req, res) => {
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
  },
  nameKey: async (req, res) => {
    try {
      const { hosname } = req.params // 从 req.params 中获取 hosname
      console.log(req.params)

      // 验证 hosname 是否存在
      if (!hosname) {
        return res.status(400).json({ code: 400, message: 'hosname is required' })
      }

      // 构建查询语句
      const query = 'SELECT * FROM HOSPITAL WHERE hosname LIKE ?'
      const queryParams = [`%${hosname}%`] // 使用百分号包裹关键字以实现模糊匹配

      // 执行查询
      db.query(query, queryParams, (error, result) => {
        if (error) {
          console.error('Database query error:', error)
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }

        // 返回查询结果
        res.json({
          code: 200,
          message: 'Ok',
          data: result
        })
      })
    } catch (err) {
      console.error('Error fetching data by hosname:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  },
  findDetail: async (req, res) => {
    try {
      const { hoscode } = req.params // 从请求参数中获取 hoscode

      // 验证 hoscode 是否存在
      if (!hoscode) {
        return res.status(400).json({ code: 400, message: 'hoscode is required' })
      }

      // 构建查询语句
      // const query = `
      //   SELECT h.*, hd.route
      //   FROM hospital h
      //   JOIN hospital_detail hd ON h.hoscode = hd.hoscode
      //   WHERE h.hoscode = ?;
      // `
      const query = `
      SELECT DISTINCT h.*, hd.*
      FROM hospital h
      JOIN hospital_detail hd ON h.hoscode = hd.hoscode
      WHERE h.hoscode=?;
    `
      const queryParams = [hoscode]

      // 执行查询
      db.query(query, queryParams, (error, result) => {
        if (error) {
          console.error('Database query error:', error)
          return res.status(500).json({ code: 500, message: 'Internal server error' })
        }
        // 返回查询结果
        res.json({
          code: 200,
          message: 'Ok',
          data: result
        })
      })
    } catch (err) {
      console.error('Error fetching data by hoscode:', err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  },
  findDepartments: (req, res) => {
    // 查询父部门
    db.query('SELECT * FROM hospital_department', (err, parentDepartmentsRows) => {
      if (err) {
        console.error('Error fetching parent departments:', err)
        return res.status(500).json({
          code: 500,
          message: '内部服务器错误',
          error: err.message // 或者其他错误详情，取决于您的需求
        })
      }
      const parentDepartmentsMap = new Map(parentDepartmentsRows.map(row => [row.depcode, { ...row, children: [] }]))

      // 查询子部门
      db.query('SELECT * FROM hospital_sub_department', (err, subDepartmentsRows) => {
        if (err) {
          console.error('Error fetching sub departments:', err)
          return res.status(500).json({
            code: 500,
            message: '内部服务器错误',
            error: err.message // 或者其他错误详情，取决于您的需求
          })
        }

        // console.log('Sub departments:', subDepartmentsRows) // 打印子部门查询结果

        for (const subDep of subDepartmentsRows) {
          const parentDep = parentDepartmentsMap.get(subDep.depcode)
          if (parentDep) {
            parentDep.children.push({ sub_depcode: subDep.sub_depcode, sub_depname: subDep.sub_depname })
          }
        }

        const departments = Array.from(parentDepartmentsMap.values())
        res.json({
          code: 200,
          message: '成功',
          data: departments
        })
      })
    })
  },
  doctorDetial: async (req, res) => {
    const { hoscode, sub_depcode } = req.query

    // 先查询医院信息
    const queryHos = `SELECT hosname FROM hospital JOIN hospital_doctor ON hospital.hoscode 
                      = hospital_doctor.hoscode WHERE hospital.hoscode = '${hoscode}'`
    let hosname = '' //医院信息
    db.query(queryHos, (error, results) => {
      if (error) {
        console.error('查询错误:', error)
        res.status(500).send('内部服务器错误')
        return
      }
      if (results.length > 0) {
        hosname = results[0].hosname
      }
    })
    //再次对医生查询
    let depcode = ''
    let sub_depname = '' //具体那个科室
    let doctor = ''
    let doctor_time = ''
    //对医生信息进行反向查询

    const queryDoc = `SELECT depcode,sub_depname FROM hospital_sub_department WHERE sub_depcode = '${sub_depcode}'`
    db.query(queryDoc, (error, results) => {
      if (error) {
        console.error('查询错误:', error)
        res.status(500).send('内部服务器错误')
        return
      }
      if (results.length > 0) {
        depcode = results[0].depcode
        sub_depname = results[0].sub_depname
        //1.查询对应的医生
        if (depcode !== '') {
          const queryone = `SELECT * FROM hospital_doctor WHERE hospital_doctor.depcode = '${depcode}'
                             AND hospital_doctor.hoscode = '${hoscode}'`
          db.query(queryone, (error, results) => {
            if (error) {
              console.log('``````````````````````````````');
              console.error('Error executing query:', error)
              return
            }
            doctor = results[0]
            console.log(results[0]);
            if (results.length > 0) {
              // 2根据医生获取排班信息
              const querytwo = ` SELECT * FROM hospital_doctor_time  WHERE hospital_doctor_time.doctorID = '${doctor.doctorID}';`
              db.query(querytwo, (error, results) => {
                if (error) {
                  console.error('Error executing query:', error)
                  res.send({
                    code: 500,
                    message: '该暂时没有医生排班信息'
                  })
                  return
                }
                doctor_time = results
                res.json({
                  code: 200,
                  message: '医生相关数据调用成功',
                  data: {
                    doctor: doctor,
                    sub_depname: sub_depname,
                    doctor_time: doctor_time,
                    hosname: hosname
                  }
                })
              })
            } else {
              console.log(results + '`````````````````');
              res.json({
                code: 200,
                message: '该医院暂时没有医院排班信息'
              })
            }
          })
        }
      }
    })
  }
}

module.exports = hospital
