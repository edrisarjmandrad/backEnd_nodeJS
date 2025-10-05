//#region packages
import express from "express";

//#region files
import userController from "../controller/user.js";
import productController from "../controller/product.js";
import authentication from '../middleware/verifyToken.js'
import onUploadImage from "../middleware/uploadImg.js"

const router = express.Router();

//region users
/**
 * @swagger
 * /api/signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [get token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *             required: [userName, email, password, isAdmin]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post("/signUp", userController.onSignUp);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login and receive a token
 *     tags: [get token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController.onLogin);
/**
 * @swagger
 * /api/send_otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [get token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required: [email]
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Validation error
 */
router.post("/send_otp", userController.onSendOtp);
/**
 * @swagger
 * /api/validate_otp:
 *   post:
 *     summary: Validate an OTP
 *     tags: [get token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *               key:
 *                 type: string
 *             required: [email, otp, key]
 *     responses:
 *       200:
 *         description: OTP validated
 *       400:
 *         description: Invalid OTP
 */
router.post("/validate_otp", userController.onValidateOtp);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/user/:id", authentication.auth, userController.onDelete);
/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Edit a user by ID
 *     tags: [users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch("/user/:id", authentication.auth, userController.onEdit);
/**
 * @swagger
 * /api/user_pass/{id}:
 *   patch:
 *     summary: Change user password by ID
 *     tags: [users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required: [oldPassword, newPassword]
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */
router.patch("/user_pass/:id", authentication.auth, userController.onEditPass);

//region Products
/**
 * @swagger
 * /api/add_product:
 *   post:
 *     summary: Add a new product
 *     tags: [products]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *               productName:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               price:
 *                 type: string
 *               inventory:
 *                 type: number
 *             required: [img, productName, categoryName, price, inventory]
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/add_product', authentication.adminOnly, onUploadImage,productController.onAddProduct)
/**
 * @swagger
 * /api/delete_product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [products]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: product id
 *     responses:
 *       200:
 *         description: product deleted
 *       403:
 *         description: Admin only
 *       404:
 *         description: product not found
 */
router.delete('/delete_product/:id', authentication.adminOnly, productController.onDeleteProduct)
/**
 * @swagger
 * /api/edit_product/{id}:
 *   patch:
 *     summary: edit a product by id
 *     tags: [products]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: product updated
 *       403:
 *         description: Admin only
 *       404:
 *         description: product not found
 */
router.patch('/edit_product/:id', authentication.adminOnly, productController.onEditProduct)
/**
 * @swagger
 * /api/get_product/{id}:
 *   get:
 *     summary: get a product by id
 *     tags: [products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: product id
 *     responses:
 *       200:
 *         description: product details
 *       403:
 *         description: Admin only
 *       404:
 *         description: product not found
 */
router.get("/get_product/:id", productController.onGetProduct)
/**
 * @swagger
 * /api/get_products:
 *   get:
 *     summary: get all products that grouped by categoryName
 *     tags: [products]
 *     responses:
 *       200:
 *         description: list of products
 */
router.get("/get_products", productController.onGetProducts)

export default router;