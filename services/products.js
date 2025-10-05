//region packages
import multer from "multer";

//region files
import productValidation from "../validation/productValidation.js";

//region model
import productModel from "../models/product.js";

export default {
    onAddProduct: async (req) => {
        try {
            const userId = req.user.userId;
            
            const validationResult = productValidation.addProduct(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: validationResult.message,
                    },
                };
            }

            if (!req.files || !req.files.img || !req.files.img[0]) {
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: "image is required",
                    },
                };
            }

            const { productName, categoryName, price, inventory } = req.body;
            const uploadedFile = req.files.img[0];
            
            const imageUrl = `/static/img/${uploadedFile.filename}`;

            await productModel.create({
                productName,
                categoryName,
                price,
                inventory,
                adminId: userId,
                img: imageUrl,
            });
            
            return {
                status: 200,
                content: { 
                    success: true, 
                    message: "product add successfully",
                    data: {
                        productName,
                        categoryName,
                        price,
                        inventory,
                        img: imageUrl
                    }
                },
            };
        } catch (error) {
            return {
                status: 500,
                content: {
                    success: false,
                    message: error.message,
                },
            };
        }
    },
    onDeleteProduct: async (req) => {
        try {
            const productId = req.params.id;
            const deleteProduct = await productModel.findByIdAndDelete(
                productId
            );
            if (!deleteProduct) {
                return {
                    status: 404,
                    content: {
                        success: true,
                        message: "product doesn't found",
                    },
                };
            }
            return {
                status: 200,
                content: {
                    success: true,
                    message: "product has deleted successfully",
                },
            };
        } catch (error) {
            return {
                statsu: 500,
                content: {
                    success: false,
                    message: error.message,
                },
            };
        }
    },
    onEditProduct: async (req) => {
        try {
            const productId = req.params.id;
            const validationResult = productValidation.editProduct(req.body);
            if (!validationResult.success)
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: validationResult.message,
                    },
                };
            const { productName, price, inventory, categoryName } = req.body;
            const foundProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: { productName, price, inventory, categoryName } }
            );
            if (!foundProduct)
                return {
                    status: 404,
                    content: { success: true, message: "product not found" },
                };
            return {
                status: 200,
                content: {
                    success: true,
                    message: "product has updated successfully",
                },
            };
        } catch (error) {
            return {
                status: 500,
                content: {
                    success: false,
                    message: error.message,
                },
            };
        }
    },
    onGetProduct: async (req) => {
        try {
            const productId = req.params.id;
            const foundProduct = await productModel.findById(productId).lean();
            if (!foundProduct)
                return {
                    status: 404,
                    content: {
                        success: true,
                        message: "product doesn't found",
                    },
                };
            return {
                status: 200,
                content: { success: true, product: foundProduct },
            };
        } catch (error) {
            return {
                status: 500,
                content: {
                    success: false,
                    message: error.message,
                },
            };
        }
    },
    onGetProducts: async (req) => {
        try {
            const allProducts = await productModel.find({}).lean();

            // group products by categoryName
            const grouped = allProducts.reduce((acc, product) => {
                const category = product.categoryName;
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
            }, {});

            // const {filterPrice} = req.body;

            return {
                status: 200,
                content: {
                    success: true,
                    products: grouped,
                },
            };
        } catch (error) {
            return {
                status: 500,
                content: { success: false, message: error.message },
            };
        }
    },
};
