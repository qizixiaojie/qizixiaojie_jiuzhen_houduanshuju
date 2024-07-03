const db = require('../../db/index')//引入数据库
const admin_hospital = {
  //对医院增加医院数据
  hospital_add: (req, res) => {
    const {
      hosname,
      hostype,
      address,
      cityCode,
      intro,
      daily_release_time,
      logoData
    } = req.body;
    // 执行查询获取最后一个 id 值
    let hoscode = ''
    db.query('SELECT MAX(id) AS last_id FROM hospital', (err, results) => {
      if (err) {
        console.error('查询错误:', err);
        return;
      }
      hoscode = results[0].last_id + 1;
      console.log(hoscode);
    });
    console.log(typeof (hostype));
    // 构建查询语句，检查是否存在相同的 hosname
    const checkQuery = `SELECT * FROM hospital WHERE hosname = '${hosname}'`;

    db.query(checkQuery, (err, results) => {
      if (err) {
        console.error('查询错误:', err);
        res.status(500).send('内部服务器错误');
        return;
      }

      if (results.length === 0) {
        // 如果不存在相同的 hosname，执行插入操作
        const insertQuery = `INSERT INTO hospital (hosname, hostype, address, cityCode, intro, daily_release_time, logoData,hoscode)
                              VALUES ('${hosname}', '${hostype}', '${address}', '${cityCode}', '${intro}', '${daily_release_time}', '${logoData}','${hoscode}')`;

        db.query(insertQuery, (err, result) => {
          if (err) {
            console.error('插入错误:', err);
            res.status(500).send('内部服务器错误');
            return;
          }
          console.log('~~~~~~~~~~~~~~~~~');
          res.send('数据添加成功');
        });
      } else {
        // 如果存在相同的 hosname，返回添加不成功的响应
        res.send('您的数据添加不成功，医院名称已存在');
      }
    });
  }
}
module.exports = admin_hospital