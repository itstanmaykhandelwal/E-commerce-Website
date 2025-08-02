import multer from "multer";

const storage = multer.diskStorage({
    filename:function(req,res,callback){
        callback(null,file.originalName)
    }
})

const upload = multer({storage})

export default upload