const mongoose = require('mongoose')
const medicineSchema = new mongoose.Schema({
    Medname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    brandname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String

    },
    brought:{
         type: String,
        default: "Mail"
    }

})






const medicines = mongoose.model("medicines", medicineSchema)
module.exports = medicines
