//import multer
const multer=require('multer')

//create config
const storage = multer.diskStorage({
    //path to store the 
    //destination is key and value shuld be function
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    //name to store the file
    filename: (req, file, callback) => {
        const fname = `image-${file.originalname}`
        callback(null, fname)
    }
})

const fileFilter = (req, file, callback) => {
    //accepts only image file
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        callback(null, true)
    }
    else {
        callback(null, false)
        return callback(new error('accept only png,jpeg,jpg file'))
    }
}
//create config
//calling multer function
const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig