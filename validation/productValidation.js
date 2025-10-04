//region packages
import Joi from "joi";

export default {
    addProduct: (data) => {
        const schema = {
            productName: Joi.string().required(),
            price: Joi.string().required(),
            inventory: Joi.number().required(),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    editProduct: (data) => {
        const schema = {
            productName: Joi.string(),
            price: Joi.string(),
            inventory: Joi.number(),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
};
