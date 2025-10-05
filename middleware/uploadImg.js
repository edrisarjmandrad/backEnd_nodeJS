import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const onUploadImage = (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const cPath = path.join("static", "img");
                cb(null, cPath);
            },
            filename: (req, file, cb) => {
                const uniqueName =
                    uuidv4().replace(/-/g, "") +
                    path.extname(file.originalname);
                cb(null, uniqueName);
            },
        });

        const upload = multer({
            storage,
            limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith("image/")) {
                    cb(null, true);
                } else {
                    cb(new Error("Only image files are allowed!"), false);
                }
            },
        });

        // Handle single or multiple fields
        const handler = upload.fields([{ name: "img", maxCount: 1 }]);

        // Execute multer middleware
        handler(req, res, (err) => {
            if (err) {
                console.log("Multer error:", err.message);
                return res
                    .status(400)
                    .json({ success: false, message: err.message });
            }
            
            // Debug: Log what multer processed
            console.log("After multer - req.files:", req.files);
            console.log("After multer - req.body:", req.body);
            
            next();
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: error.message });
    }
};

export default onUploadImage;
