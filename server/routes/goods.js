var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var Users = require('../models/users');


// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall');

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success")
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail")
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected")
});


router.get("/", function (req, res, next) {
    let page = Number(req.param("page")) || 1;
    let max = Number(req.param("max")) || 8;
    let sort = req.param("sort") || 1;
    let priceLevel = req.param("priceLevel");
    var priceGt, priceLte;

    let params = {};
    console.log(priceLevel);
    if (priceLevel && priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLte = 100;
                break;
            case '1':
                priceGt = 100;
                priceLte = 500;
                break;
            case '2':
                priceGt = 500;
                priceLte = 1000;
                break;
            case '3':
                priceGt = 1000;
                priceLte = 2000;
                break;
        }

        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte,
            }
        };
    }

    let start = (page - 1) * max;

    // // skip代表从第几条开始查。
    let goodsModel = Goods.find(params).skip(start).limit(max);
    // let goodsModel = Goods.find();
    goodsModel.sort({'salePrice': sort});
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: "1",
                code: err.code,
                msg: err.message,
                data: null,
            })
        } else {
            res.json({
                status: "0",
                data: {
                    list: doc,
                    count: doc.length,
                },
                msg: "",
            })
        }
    });
})

router.post("/addCart", (req, res, next) => {
    var userId = '100000077';
    var productId = req.body.productId;
    Users.findOne({
        userId: userId,
    }, (userErr, userDoc) => {
        if (userErr) {
            res.json({
                status: "1",
                msg: userErr.message,
                data: null,
            })
        } else {
            if (userDoc) {
                Goods.findOne({
                    productId: productId
                }, (productErr, productDoc) => {
                    if (productErr) {
                        res.json({
                            status: "1",
                            msg: productErr
                        })
                    } else {
                        if (productDoc) {
                            var list = userDoc.cartList,
                                isNew = true;
                            list.map((item)=> {
                                if(item.productId == productId) {
                                    isNew = false;
                                    item.productNum = Number(item.productNum) + 1;
                                    return;
                                }
                            })

                            if(isNew) {
                                productDoc.productNum = 1;
                                productDoc.checked = 1;
                                userDoc.cartList.push(productDoc);
                            }

                            userDoc.save((err, doc) => {
                                if (err) {
                                    res.json({
                                        status: "1",
                                        msg: err.message
                                    })
                                } else {
                                    res.json({
                                        status: "0",
                                        msg: "success",
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

module.exports = router;
