//#region packages
import Joi from "joi";

export default {
    createUser: (data) => {
        const schema = {
            userName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().allow("", null),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    login: (data) => {
        const schema = {
            email: Joi.string().required(),
            password: Joi.string().required(),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    sendOtp: (data) => {
        const schema = {
            email: Joi.string().required(),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
    delete: (data) => {
        const schema = {
            email: Joi.string().required(),
        };
        const { error, value } = schema.validate(data);
        if (error) return { success: false, message: error.details[0].message };
        return { success: true, message: null };
    },
};
