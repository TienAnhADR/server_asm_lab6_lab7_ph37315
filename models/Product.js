const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
    namePro: {
        type: String,
        require: true
    },
    pricePro: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    }
})
module.exports = mongoose.model('product',ProductSchema)