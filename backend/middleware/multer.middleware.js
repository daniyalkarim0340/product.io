import multer from "multer";

const imagemulter=function (maxsize,allowType) {
    const storage=multer.memoryStorage();
    const limits={fileSize:maxsize*1024*1024}
    const filter=(req,file,cb)=>{
        if (allowType.includes(file.mimetype)) {
            return cb(null,true)
            
        }
        return cb(new Error("Invalid file type"),false)
    }

    return multer({storage,limits,fileFilter:filter});
};

export default imagemulter
