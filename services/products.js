//region packages
import productValidation from "../validation/productValidation.js";

//region model
import productModel from "../models/product.js";

export default {
    onAddProduct: async (req) => {
        try {
            const validationResult = productValidation.addProduct(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        success: false,
                        message: validationResult.message,
                    },
                };
            }
            const { productName, price, inventory } = req.body;
            await productModel.insentOne({
                productName,
                price,
                inventory,
                adminId: userId,
            });
            return {
                status: 200,
                content: { success: true, message: "product add successfully" },
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
    onDeleteProduct: async (req) => {
        try {
            const productId = req.params;
            const deleteProduct = await productModel.findByIdAndDelete(
                productId
            );
            if (!deleteProduct) {
                return {
                    status: 404,
                    content: {
                        success: false,
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
            const productId = req.params;
            const validationResult = productValidation.editProduct(req.body);
            if (!validationResult.success)
                return {
                    status: 400,
                    content: {
                        success: false,
                        message: validationResult.message,
                    },
                };
            const { productName, price, inventory } = req.body;
            const foundProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: { productName, price, inventory } }
            );
            if (!foundProduct)
                return {
                    status: 404,
                    content: { success: false, message: "product not found" },
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
                statsu: 500,
                content: {
                    success: false,
                    message: error.message,
                },
            };
        }
    },
    onGetProduct: async (req) => {
        try {
            const productId = req.params;
            const foundProduct = productModel.findById({ productId }).lean();
            if (!foundProduct)
                return {
                    status: 404,
                    content: {
                        success: false,
                        message: "product doesn't found",
                    },
                };
            return {
                status: 200,
                content: { success: false, product: foundProduct },
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
    onGetProducts: async (req) => {
        try {
            const allProducts = await productModel.find({}).lean();
            return {
                status: 200,
                content: {
                    success: true,
                    products: allProducts,
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
