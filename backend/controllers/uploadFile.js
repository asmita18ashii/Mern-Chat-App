const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now}-${file.originalname}`)
    }
})

const upload=multer({storage});

const uploadFile=(req,res)=>{
    const file=req.file;

    if(!file){
       return res.sendStatus(400).send('No file found!');
    }
    res.sendStatus(200).json({filePath:`/uploads/${file.filename}`,file})
}


module.exports = uploadFile
