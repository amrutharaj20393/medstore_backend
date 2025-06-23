const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    Medname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brandname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
})



const cart = mongoose.model("carts", cartSchema)
module.exports = cart
