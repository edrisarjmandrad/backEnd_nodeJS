//region packages
import productServiece from "../services/products.js";

export default {
    onAddProduct: async (req, res) => {
        try {
            const response = await productServiece.onAddProduct(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
    onDeleteProduct: async (req, res) => {
        try {
            const response = await productServiece.onDeleteProduct(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
    onEditProduct: async (req, res) => {
        try {
            const response = await productServiece.onEditProduct(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
    onGetProduct: async (req, res) => {
        try {
            const response = await productServiece.onGetProduct(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
    onGetProducts: async (req, res) => {
        try {
            const response = await productServiece.onGetProducts(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
};
