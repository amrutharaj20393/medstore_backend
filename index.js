//import dtenv file
const dotenv = require('dotenv')
dotenv.config()//load envirnment variables

const express = require('express')
//import route
const route = require('./routes')

const cors = require('cors')

const netmedServer = express()
netmedServer.use(cors())
//parse json data from frontend.its middleware(it break request response cycle).
netmedServer.use(express.json())
netmedServer.use(route)

//import db connection file
require('./databaseconnection')
PORT = 3000 || process.env.PORT

netmedServer.listen(PORT, () => {
    console.log(`server running successfilly ${PORT}`)
})