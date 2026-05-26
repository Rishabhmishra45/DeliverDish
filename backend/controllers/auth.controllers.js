import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

export const signUp = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password,
            mobile,
            role
        } = req.body;

        if (!fullName || !email || !password || !mobile || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User Already exist."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        if (mobile.length !== 10) {
            return res.status(400).json({
                message: "Mobile number must be exactly 10 digits."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        return res.status(201).json(user);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: `sign up error ${error.message}`
        });
    }
};

export const signIn = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User does not exists."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        return res.status(200).json(user);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: `sign in error ${error.message}`
        });
    }
};

export const signOut = async (req, res) => {

    try {

        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: `sign out error ${error.message}`
        });
    }
};