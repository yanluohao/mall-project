var express = require('express');
var router = express.Router();
require("./../util/util");

var User = require('./../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 登录
router.post('/login', function (req, res, next) {
    let param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    }

    User.findOne(param, (err, user) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
            })
        } else {
            if (user) {
                res.cookie("userId", user.userId, {
                    path: "/",
                    maxAge: 1000 * 60 * 60,
                })
                res.cookie("userName", user.userName, {
                    path: "/",
                    maxAge: 1000 * 60 * 60,
                })
                // req.session.user = user;
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        userName: user.userName,
                    }
                })
            } else {
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

// 状态校验
router.get("/checkLogin", function (req, res, next) {
    if (req.cookies && req.cookies.userId) {
        res.json({
            status: "0",
            msg: "",
            result: {
                userName: req.cookies.userName,
            }
        })
    } else {
        res.json({
            status: "1",
            msg: "当前未登录用户",
        })
    }
})

// 查询当前用户的购物车状态
router.get("/cartList", function (req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, (err, user) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: "",
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: user.cartList,
            })
        }
    })
})

// 当前用户的购物车删除
router.post("/cart/del", function (req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.productId;
    User.update(
        {
            userId: userId
        },
        {
            $pull: {
                "cartList": {
                    "productId": productId,
                }
            }
        }, function (err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message,
                    result: ""
                })
            } else {
                res.json({
                    status: "0",
                    msg: "商品删除成功",
                    result: "",
                })
            }
        }
    )
})

// 当前用户的购物车编辑
router.post("/cart/edit", function (req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.product.productId,
        productNum = req.body.product.productNum,
        checked = req.body.product.checked;
    User.update({
        userId: userId,
        "cartList.productId": productId
    }, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked,
    }, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "商品编辑成功",
                result: "",
            })
        }
    })
})

// 当前用户的全选和全不选
router.post("/cart/checkAll", function (req, res, next) {
    var userId = req.cookies.userId,
        checkAll = req.body.checkAll ? "1" : "0";
    User.findOne({
        userId: userId
    }, function (err, user) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: "",
            })
        } else {
            if (user) {
                user.cartList.forEach((item) => {
                    item.checked = checkAll;
                })
                user.save(function (err1, doc) {
                    if (err1) {
                        res.json({
                            status: "1",
                            msg: err1.message,
                            result: "",
                        })
                    } else {
                        res.json({
                            status: "0",
                            msg: "",
                            result: "",
                        })
                    }
                })
            }
        }
    })
})

// 获取用户的地址信息
router.get("/address/list", function (req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({
        userId: userId
    }, function (err, user) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: "",
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: user.addressList,
            })
        }
    })
})

// 设置默认地址
router.post("/address/setDefault", function (req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (!addressId) {
        res.json({
            status: "1",
            msg: "addressId is null",
            result: "",
        })
    }
    User.findOne({
        userId: userId
    }, function (err, user) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: "",
            })
        } else {
            var list = user.addressList;
            list.forEach((item) => {
                if (item.addressId == addressId) {
                    item.isDefault = true;
                } else {
                    item.isDefault = false;
                }
            })

            user.save(function (err1, doc) {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: err1.message,
                        result: "",
                    })
                } else {
                    res.json({
                        status: "0",
                        msg: "",
                        result: "",
                    })
                }
            })
        }
    })
})

// 删除地址
router.post("/address/delete", function (req, res, next) {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    User.update({
        userId: userId
    }, {
        $pull: {
            "addressList": {
                "addressId": addressId
            }
        }
    }, function (err, info) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: "",
            })
        }
    })
})

// 生成订单
router.post("/payMent", function (req, res, next) {
    var userId = req.cookies.userId,
        orderTotal = req.body.orderTotal,
        addressId = req.body.addressId;
    User.findOne({
        userId: userId
    }, function (err, user) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            var address = "",
                goodsList = [];
            // 订单的地址信息
            user.addressList.forEach((item) => {
                if (addressId == item.addressId) {
                    address = item;
                }
            })

            //订单的商品
            user.cartList.forEach((item) => {
                if (item.checked == "1") {
                    goodsList.push(item);
                }
            })


            var platform = "622";
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);

            var sysDate = new Date().Format("yyyyMMddhhmmss");
            var createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var orderId = platform + r1 + sysDate + r2;

            // 订单
            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: "1",
                createDate: createDate,
            }

            var list = user.orderList;
            list.push(order);
            user.orderList = list;

            // 这个本人也很无奈，注释语句执行报错，改成上面的就好了
            // user.orderList.push(order);
            user.save(function (err2, doc2) {
                if (err2) {
                    res.json({
                        status: "1",
                        msg: err2.message,
                        result: ""
                    })
                } else {
                    res.json({
                        status: "0",
                        msg: "",
                        result: {
                            orderId: order.orderId,
                            orderTotal: order.orderTotal,
                        },
                    })
                }
            })
        }
    })
})

module.exports = router;
