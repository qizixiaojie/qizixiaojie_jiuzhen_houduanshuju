const db = require('../../db/index')//引入数据库
const admin_doctor = {
  doctor_add: (req, res) => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(req.body, '`````````');
    res.send({
      code: 200,
      message: 'dadasda'
    });
  }
}
module.exports = admin_doctor