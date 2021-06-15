const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, `${process.cwd()}/src/client/assets/images/profile-imgs`);
    // },
    destination: function (req, file, cb) {
        cb(null, `./images`);
    },
    filename: function(_, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single("picture");
  
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    cb("Error: Images Only!");    
}

module.exports = upload;
