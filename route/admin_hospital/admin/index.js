const db = require('../../db/index')//引入数据库 
var multiparty = require('multiparty');
let form = new multiparty.Form()
const admin_hospital = {
  //对医院增加医院数据
  hospital_add: (req, res) => {
    form.parse(req, function (err, fields, file) {
      console.log(fields);
      const {
        hosname,
        hostype,
        address,
        cityCode,
        intro,
        daily_release_time,
        logoData
      } = fields
      // console.log(hosname);
      if (!logoData) {
        return res.status(500)
      }

      // 执行查询获取最后一个 id 值
      let hoscode = ''
      if (hosname) {
        db.query('SELECT MAX(id) AS last_id FROM hospital', (err, results) => {
          if (err) {
            console.error('查询错误:', err);
            return;
          }
          hoscode = results[0].last_id + 1;
        });
      }
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
            console.log('添加成功');
            res.send({
              code: 200,
              messasge: 'success'
            });
          });
        } else {
          // 如果存在相同的 hosname，返回添加不成功的响应
          res.send('您的数据添加不成功，医院名称已存在');
        }
      });
    })
  },
  hospital_getList: (req, res) => {
    const query = 'SELECT * FROM hospital';

    db.query(query, (err, results) => {
      if (err) {
        console.error('获取数据失败', err);
        res.status(500).json({ error: '获取数据失败，无法连接服务器' });
        return;
      }

      res.send({
        code: 200,
        data: results,
        message: '查询数据成功'
      })
    });
  },
  hospital_delete: (req, res) => {
    const { id } = req.body;
    console.log(req.body);
    // 确保 id 存在且不为 1
    if (!id || id === 1) {
      return res.status(400).json({ error: '无效的 ID，无法删除 ID 为 1 的记录' });
    }

    const query = 'DELETE FROM hospital WHERE id = ? AND id <> 1';

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('删除医院数据时出错:', err);
        return res.status(500).json({ error: '删除医院数据失败' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: '未找到指定 ID 的医院，或尝试删除 ID 为 1 的记录' });
      }

      res.status(200).json({ message: '医院删除成功' });
    });
  },
  //修改医院信息
  hospital_update: (req, res) => {
    form.parse(req, function (err, fields, file) {
      const { hosname, hostype, address, cityCode, intro, daily_release_time, logoData } = fields;
      console.log(req.body);
      // 先根据 hosname 查询对应的 id
      const idQuery = `SELECT id FROM hospital WHERE hosname = '${hosname}'`;

      db.query(idQuery, (err, results) => {

        if (err) {
          console.error('查询错误:', err);
          res.status(500).send('内部服务器错误');
          return;
        }

        if (results.length === 0) {
          // 如果没有找到对应 hosname 的记录，返回错误响应
          res.send('未找到对应医院名称的记录，无法更新');
          return;
        }

        const id = results[0].id;  // 获取查询到的 id

        // 构建更新语句
        const updateQuery = `UPDATE hospital 
                            SET hosname = '${hosname}', hostype = '${hostype}', address = '${address}', cityCode = '${cityCode}', intro = '${intro}', daily_release_time = '${daily_release_time}', logoData = '${logoData}'
                            WHERE id = '${id}'`;

        db.query(updateQuery, (err, result) => {
          if (err) {
            console.error('更新错误:', err);
            res.status(500).send('内部服务器错误');
            return;
          }
          console.log('更新成功');
          res.send({
            code: 200,
            message: '更新成功'
          });
        });
      });
    })

  }
}
module.exports = admin_hospital