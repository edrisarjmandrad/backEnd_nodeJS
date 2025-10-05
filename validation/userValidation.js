//#region packages
import Joi from "joi";

export default {
    createUser: (data) => {
        const schema = Joi.object({
            userName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required().min(8),
            phone: Joi.string().allow("", null).length(11),
            isAdmin: Joi.boolean().allow("", null),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    login: (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    sendOtp: (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },validateOtp: (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            otp: Joi.string().required(),
            key: Joi.string().required()
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    delete: (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
        });
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
};
