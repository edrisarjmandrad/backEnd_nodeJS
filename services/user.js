//#region packages
import userValidation from "../validation/userValidation.js";
import emailRegex from "email-regex";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import utils from "../utils/regex.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

//#regjion models
import userModel from "../models/user.js";
import otpModel from "../models/otp.js";
export default {
    onCreateService: async (req) => {
        try {
            const validationResult = userValidation.createUser(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        message: validationResult.message,
                    },
                };
            }
            const { userName, email, password, phone } = req.body;
            const validateEmail = emailRegex({ exact: true }).test(email);
            if (!validateEmail) {
                return {
                    status: 200,
                    content: {
                        message: "please enter a valid email",
                    },
                };
            }
            const foundUser = await userModel.findOne({ $or: [{ email, phone }] });
            if (foundUser) {
                return {
                    status: 200,
                    content: {
                        message: "you already signup with thsi info",
                    },
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.insertOne({
                userName,
                email,
                password: hashedPassword,
                phone,
                lastLogin: Date.now(),
            });
            return {
                status: 200,
                content: {
                    message: "user has created successfully",
                    success: true,
                },
            };
        } catch (error) {
            return {
                status: 500,
                content: {
                    message: error.message,
                    success: false,
                },
            };
        }
    },
    onLogin: async (req) => {
        try {
            const validationResult = userValidation.login(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        message: validationResult.message,
                    },
                };
            }
            const { email, password } = req.body;
            const foundUser = await userModel.findOne({ email }).lean();
            if (!foundUser) {
                return {
                    status: 200,
                    content: {
                        message: "user not found",
                    },
                };
            }
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (!isMatch) {
                return {
                    status: 401,
                    content: {
                        message: "Invalid password",
                    },
                };
            }

            const token = jwt.sign(
                { userId: foundUser._id, email: foundUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return {
                status: 200,
                content: {
                    message: "Login successfuly",
                    success: true,
                    token,
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
    onSendOtp: async (req) => {
        try {
            const validationResult = userValidation.sendOtp(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        success: false,
                        message: validationResult.message,
                    },
                };
            }
            const { email } = req.body;

            const otp = Math.floor(100000 + Math.random() * 900000);

            await sendEmail({
                to: email,
                subject: "test otp",
                text: `Your OTP code is: ${otp}`,
            });

            const key = crypto.randomBytes(16).toString("hex");
            await otpModel.insertOne({ email, otp, key });

            return {
                status: 200,
                content: {
                    message: "otp has send to email",
                    success: true,
                    key,
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
    onDelete: async (req) => {
        try {
            const { id } = req.params;
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return {
                    status: 400,
                    content: {
                        message: "Invalid user id",
                    },
                };
            }

            const deletedUser = await userModel.findByIdAndDelete(id).lean();
            if (!deletedUser) {
                return {
                    status: 404,
                    content: {
                        message: "User not found",
                    },
                };
            }

            return {
                status: 200,
                content: {
                    message: "User deleted successfully",
                    success: true,
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
    onEdit: async (req) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return {
                    status: 400,
                    content: {
                        message: "Invalid user id",
                    },
                };
            }

            // Prevent password update without hashing
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = await userModel
                .findByIdAndUpdate(id, { $set: updateData }, { new: true })
                .lean();

            if (!updatedUser) {
                return {
                    status: 404,
                    content: {
                        message: "User not found",
                    },
                };
            }

            return {
                status: 200,
                content: {
                    message: "User updated successfully",
                    success: true,
                    user: updatedUser,
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
};
