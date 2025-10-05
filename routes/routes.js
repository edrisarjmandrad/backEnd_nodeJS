//#region packages
import express from "express";

//#region files
import userController from "../controller/user.js";
import productController from "../controller/product.js";
import authentication from '../middleware/verifyToken.js'
import onUploadImage from "../middleware/uploadImg.js"

const router = express.Router();

//region users
router.post("/signUp", userController.onSignUp);
router.post("/login", userController.onLogin);
router.post("/send_otp", userController.onSendOtp);
router.post("/validate_otp", userController.onValidateOtp);
router.delete("/user/:id", authentication.auth, userController.onDelete);
router.patch("/user/:id", authentication.auth, userController.onEdit);
router.patch("/user_pass/:id", authentication.auth, userController.onEditPass);

//region Products
router.post('/add_product', authentication.adminOnly, onUploadImage,productController.onAddProduct)
router.delete('/delete_product/:id', authentication.adminOnly, productController.onDeleteProduct)
router.patch('/edit_product/:id', authentication.adminOnly, productController.onEditProduct)
router.get("/get_product/:id", productController.onGetProduct)
router.get("/get_products", productController.onGetProducts)

export default router;