//#region packages
import userService from "../services/user.js";

export default {
    onSignUp: async (req, res) => {
        try {
            const response = await userService.onCreateService(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error,
            });
        }
    },
    onLogin: async (req, res) => {
        try {
            const response = await userService.onLogin(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error,
            });
        }
    },
    onSendOtp: async (req, res) => {
        try {
            const response = await userService.onSendOtp(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error,
            });
        }
    },
    onValidateOtp: async (req, res) => {
        try {
            const response = await userService.onValidateOtp(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: error,
            });
        }
    },
    onSendOtpWithRedis: async (req, res) => {
        try {
            const response = await userService.onSendOtpWithRedis(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({ success: false, message: error });
        }
    },
    onValidateOtpWithRedis: async (req, res) => {
        try {
            const response = await userService.onSendOtpWithRedis(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({ success: false, message: error });
        }
    },
    onDelete: async (req, res) => {
        try {
            const response = await userService.onDelete(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({ success: false, message: error });
        }
    },
    onEdit: async (req, res) => {
        try {
            const response = await userService.onEdit(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res.status(500).send({ success: false, message: error });
        }
    },
    onEditPass: async (req, res) => {
        try {
            const response = await userService.onEditPass(req);
            return res.status(response.status).send(response.content);
        } catch (error) {
            return res
                .status(500)
                .send({ success: false, message: error.message });
        }
    },
};
