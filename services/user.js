//#region packages
import userValidation from "../validation/userValidation.js";
import emailRegex from "email-regex";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

//#region models
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
            const { userName, email, password, phone, isAdmin } = req.body;
            const validateEmail = emailRegex({ exact: true }).test(email);
            if (!validateEmail) {
                return {
                    status: 200,
                    content: {
                        success: false,
                        message: "please enter a valid email",
                    },
                };
            }
            const foundUser = await userModel.findOne({
                email,
            });
            if (foundUser) {
                return {
                    status: 409,
                    content: {
                        success: true,
                        message: "there's an account with thsi email",
                    },
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const createUser = await userModel.insertOne({
                userName,
                email,
                password: hashedPassword,
                phone,
                isAdmin,
                lastLogin: Date.now(),
            });
            const token = jwt.sign(
                { userId: createUser._id, isAdmin: createUser.isAdmin },
                process.env.TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            return {
                status: 200,
                content: {
                    message: "user has created successfully",
                    success: true,
                    token,
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
                        success: false,
                        message: validationResult.message,
                    },
                };
            }
            const { email, password } = req.body;
            const foundUser = await userModel.findOne({ email }).lean();
            const notFound = await userNotFoundResponse(foundUser);
            if (notFound) return notFound;
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (!isMatch) {
                return {
                    status: 401,
                    content: {
                        message: "Invalid password",
                    },
                };
            }

            await userModel.updateOne(
                { _id: foundUser._id },
                { $set: { lastLogin: Date.now() } }
            );

            const token = jwt.sign(
                { userId: foundUser._id, isAdmin: foundUser.isAdmin },
                process.env.TOKEN_SECRET,
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

            const foundUser = userModel.findOne({ email }).lean();
            const notFound = await userNotFoundResponse(foundUser);
            if (notFound) return notFound;

            const otp = Math.floor(100000 + Math.random() * 900000);

            // await sendEmail({
            //     to: email,
            //     subject: "test otp",
            //     text: `Your OTP code is: ${otp}`,
            // });

            const expireTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

            const key = crypto.randomBytes(16).toString("hex");
            await otpModel.insertOne({
                email,
                otp,
                key,
                createAt: Date.now(),
                expireAt: expireTime,
            });

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
    onValidateOtp: async (req) => {
        try {
            const validationResult = userValidation.validateOtp(req.body);
            if (!validationResult.success) {
                return {
                    status: 400,
                    content: {
                        success: false,
                        message: validationResult.message,
                    },
                };
            }

            const { email, key, otp } = req.body;

            const foundUser = await userModel.findOne({ email }).lean();
            const notFound = await userNotFoundResponse(foundUser);
            if (notFound) return notFound;

            const otpRecord = await otpModel.findOne({ email, key }).lean();
            if (!otpRecord) {
                return {
                    status: 404,
                    content: {
                        success: true,
                        message: "otp not found",
                    },
                };
            }

            if (otpRecord.expireAt < new Date()) {
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: "otp has expired",
                    },
                };
            }

            if (otpRecord.otp !== Number(otp)) {
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: "invalid otp code",
                    },
                };
            }

            await otpModel.deleteOne({ _id: otpRecord._id });

            const token = jwt.sign(
                { userId: foundUser._id, isAdmin: foundUser.isAdmin },
                process.env.TOKEN_SECRET,
                { expiresIn: "1h" }
            );

            return {
                status: 200,
                content: {
                    success: true,
                    message: "otp validated successfully",
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
    onDelete: async (req) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string" || id.length === 0) {
                return {
                    status: 400,
                    content: {
                        success: true,
                        message: "Invalid user id",
                    },
                };
            }

            const deletedUser = await userModel.findByIdAndDelete(id).lean();
            const notFound = await userNotFoundResponse(deletedUser);
            if (notFound) return notFound;

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
            const { userName, email, phone } = req.body;

            if (!id || typeof id !== "string" || id.length === 0) {
                return {
                    status: 400,
                    content: {
                        message: "Invalid user id",
                    },
                };
            }

            const updatedUser = await userModel
                .findByIdAndUpdate(
                    id,
                    { $set: { userName, email, phone } },
                    { new: true }
                )
                .lean();

            const notFound = await userNotFoundResponse(updatedUser);
            if (notFound) return notFound;

            return {
                status: 200,
                content: {
                    message: "User updated successfully",
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
    onEditPass: async (req) => {
        try {
            const { id } = req.params;
            const { password } = req.body;

            if (!id || typeof id !== "string" || id.length === 0) {
                return {
                    status: 400,
                    content: {
                        message: "Invalid user id",
                    },
                };
            }
            const foundUser = await userModel.findById(id).lean();
            const notFound = await userNotFoundResponse(foundUser);
            if (notFound) return notFound;

            if(password.length < 8) {
                return {
                    status: 400,
                    content: {
                        message: "Password must be at least 8 characters long",
                    },
                };
            }

            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (isMatch) {
                return {
                    status: 200,
                    content: {
                        success: false,
                        messaeg:
                            "the password should not be the same as last one",
                    },
                };
            }

            const hashPass = await bcrypt.hash(password, 10);

            await userModel.findByIdAndUpdate(
                id,
                { $set: { password: hashPass } },
                { new: true }
            );
            return {
                status: 200,
                content: {
                    success: false,
                    message: "password update successfully",
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

async function userNotFoundResponse(user) {
    if (!user) {
        return {
            status: 404,
            content: {
                success: false,
                message: "user not found",
            },
        };
    }
    return null;
}
