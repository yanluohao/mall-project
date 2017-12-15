var express = require('express');
var router = express.Router();

var User = require('./../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post('/login', function (req, res, next) {
    let param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    }

    User.findOne(param, (err, user) => {
        if(err) {
            res.json({
                status: "1",
                msg: err.message,
            })
        }else {
            if(user) {
                res.cookie("userId", user.userId, {
                    path: "/",
                    maxAge: 1000*60*60,
                })
                // req.session.user = user;
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        userName: user.userName,
                    }
                })
            }else {
                res.json({
                    status: "1",
                    msg: "用户名密码错误",
                })
            }
        }
    })
})

// 登出
router.post("/logout", function (req, res, next) {
    res.cookie("userId", "", {
        path: "/",
        maxAge: -1,
    });
    res.json({
        status: "0",
        msg: "",
        result: "",
    })
})

module.exports = router;
