const db = require('../../db/index')//引入数据库
const admin_doctor = {
  doctor_add: (req, res) => {
    const { name, position, sub_depname, hosname, introduce } = req.body
    let hoscode = ''//获取医院编码
    if (hosname) {
      const sql = `select hoscode from hospital where hosname='${hosname}'`
      db.query(sql, [hosname], (err, result) => {
        if (err) {
          res.send({
            code: 500,
            meassage: '您还未添加这个医院信息'
          })
        }
        hoscode = result[0].hoscode
      })
    }
    //寻找部门信息
    let depcode = '';
    let depname = ''
    const money = '20'
    if (!sub_depname) {
      return res.status(400).json({ code: 400, message: 'sub_depname 不能为空' });
    }

    const sql = 'SELECT depcode FROM hospital_sub_department WHERE sub_depname = ?';
    db.query(sql, [sub_depname], (err, result) => {
      if (err) {
        console.error('查询子部门出错:', err);
        return res.status(500).json({ code: 500, message: '查询子部门出错' });
      }

      if (result.length === 0) {
        return res.status(404).json({ code: 404, message: '您找的部门不存在' });
      }

      depcode = result[0].depcode;

      const sql1 = 'SELECT depname FROM hospital_department WHERE depcode = ?';
      db.query(sql1, [depcode], (err, result) => {
        if (err) {
          console.error('查询科室出错:', err);
          return res.status(500).json({ code: 500, message: '查询科室出错' });
        }

        if (result.length === 0) {
          return res.status(404).json({ code: 404, message: '您所在的科室不存在' });
        }
      });
    });
    //获取doctorID
    let doctorID = ""
    const sql2 = 'SELECT MAX(id) AS maxId FROM hospital_doctor';

    db.query(sql2, (err, results) => {
      if (err) {
        console.error('查询最大ID出错:', err);
        return res.status(500).json({ code: 500, message: '查询最大ID出错' });
      }

      doctorID = results[0].maxId;
      const sql3 = `
    INSERT INTO hospital_doctor (name, depcode, introduce, position,money, doctorID, hoscode)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;



      db.query(sql3, [name, depcode, introduce, position, money, doctorID, hoscode], (err, result) => {
        if (err) {
          console.error('插入医生数据时出错:', err);
          return res.status(500).json({ code: 500, message: '插入医生数据失败' });
        }

        //插入排班数据
        let getRandomInt = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        if (!doctorID || !hoscode) {
          return res.status(400).json({ code: 400, message: 'doctorID 和 hoscode 是必需的字段' });
        }

        const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const sql = `
          INSERT INTO hospital_doctor_time (state, morningCount, afternoonCount, toDay, doctorID, hoscode)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = daysOfWeek.map(day => [
          getRandomInt(0, 1),       // state
          getRandomInt(0, 20),      // morningCount
          getRandomInt(0, 20),      // afternoonCount
          day,                      // toDay
          doctorID,                 // doctorID
          hoscode                   // hoscode
        ]);


        const flattenedValues = values.flat();

        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');

        const fullSql = `INSERT INTO hospital_doctor_time (state, morningCount, afternoonCount, toDay, doctorID, hoscode) VALUES ${placeholders}`;

        db.query(fullSql, flattenedValues, (err, result) => {
          if (err) {
            console.error('插入医生时间数据时出错:', err);
            return res.status(500).json({ code: 500, message: '插入医生时间数据失败' });
          }

          res.status(200).json({ code: 200, message: '医生时间数据插入成功' });
        });
      }

      )
    })




  }
}
module.exports = admin_doctor