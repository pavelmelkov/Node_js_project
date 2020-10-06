const multer = require('multer')
const path =require('path')
const put = 'C:/Users/Павел/Desktop/app_express/images/'
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
        // console.log(path.join(__dirname, '..', '/images/'))
    },
    filename(req, file, cb) {
        cb(null, file.originalname )
    }

})
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)

    } else {
        cb(null, false)
    }
}
module.exports = multer({
    storage,
    fileFilter
})