let mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "checked": String,
    "productNum": Number,
    "productImage": String,
})

module.exports = mongoose.model('Good', productSchema);
