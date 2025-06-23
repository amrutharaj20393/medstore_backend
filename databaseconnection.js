const mongoose = require('mongoose')

const connectionString = process.env.DATABASE



mongoose.connect(connectionString).then(() => {
    console.log("mongodb connected")
}).catch((err) => {
    console.log("mongodb connection failed")
})