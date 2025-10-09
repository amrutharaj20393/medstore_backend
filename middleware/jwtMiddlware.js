const jwt = require('jsonwebtoken')
//tto verify token of the admin
const jwtMiddleware = (req, res, next) => {
    //console.log("inside")
    const token = req.headers['authorization'].split(' ')[1]


    try {
 console.log(token)
        const jwtResponse = jwt.verify(token, 'secretkey')//it returns usermail and isued time
        //console.log(jwtResponse)
        req.payload = jwtResponse.userMail//pass req.payload to controller to identify who added medicine
        next()
    } catch (error) {
        res.status(401).json("invalid token")
    }


}
module.exports = jwtMiddleware