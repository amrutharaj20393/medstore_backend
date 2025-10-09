const users = require("../model/usermodel")
const jwt = require('jsonwebtoken')

exports.registerController = async (req, res) => {

    const { username, email, password } = req.body
    console.log(username, email, password)

    try {
        const existinguser = await users.findOne({ email })
        if (existinguser) {
            res.status(400).json('User Already exist')
        }
        else {
            const newuser = new users({
                username, email, password
            })
            await newuser.save()
            res.status(200).json(newuser)
        }

    } catch (error) {
        res.status(500).json(error)
    }


}

exports.loginController = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    try {
        const existinguser = await users.findOne({ email })
        if (existinguser) {
            if (existinguser.password == password) {
                const token = jwt.sign({ userMail: existinguser.email }, 'secretkey')
                res.status(200).json({ existinguser, token })
            }

        }
        else {
            res.status(404).json("incorrect email or password")
        }

    } catch (error) {
        res.status(500).json(error)
    }

}

exports.googleLoginController = async (req, res) => {
    const { username, email, password } = req.body
    console.log(username, email, password)
    try {

        const existinguser = await users.findOne({ email })
        if (existinguser) {
            //token creation
            const token = jwt.sign({ userMail: existinguser.email }, 'secretkey')
            res.status(200).json({ existinguser, token })


        }
        else {

            //register new user for google login user
            const newuser = new users({
                username, email, password
            })
            await newuser.save()
            const token = jwt.sign({ userMail: newuser.email }, 'secretkey')
            await newuser.save()
            res.status(200).json({ existinguser: newuser, token })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllUserAdminController = async (req, res) => {


    try {

        const allUserAdmin = await users.find()
        console.log(allUserAdmin)
        res.status(200).json(allUserAdmin)

    } catch (error) {
        res.status(500).json(error)
    }
}
exports.editUserProfileController = async (req, res) => {
    const { username, password,  profile } = req.body
    const prof = req.file ? req.file.filename : profile
    console.log(prof)
    const email = req.payload
    console.log(email)
    try {

        const Userdetails = await users.findOneAndUpdate({ email }, { username, email, profile: prof, password}, { new: true })
        await Userdetails.save()
        res.status(200).json(Userdetails)
    } catch (error) {
        res.status(500).json(error)
    }


}
