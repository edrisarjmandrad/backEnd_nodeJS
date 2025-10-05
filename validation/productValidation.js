//region packages
import Joi from "joi";

export default {
    addProduct: (data) => {
        const schema = Joi.object({
            productName: Joi.string().required(),
            categoryName: Joi.string().required(),
            price: Joi.string().required(),
            inventory: Joi.number().required(),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    editProduct: (data) => {
        const schema = Joi.object({
            productName: Joi.string().allow("", null),
            categoryName: Joi.string().allow("", null),
            price: Joi.string().allow("", null),
            inventory: Joi.number().allow("", null),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
};
