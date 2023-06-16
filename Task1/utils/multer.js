import multer from "multer";

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,"./images");
    },
    filename: (req, file, callback) => {
        callback(null,file.fieldname + '-' + Date.now());
    }
});

export const upload = multer({
    storage: Storage 
}).single('image');