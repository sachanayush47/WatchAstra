import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";

const signUp = asyncHandler(async (req, res) => {
    const { name, adminUsername, password } = req.body;

    // Validate user input
    if (!(name && adminUsername && password)) {
        res.status(400);
        throw new Error("All inputs are required");
    }
    // Check if user already exist, validate if user exist in our database
    const oldUser = await Admin.findOne({ adminUsername });

    if (oldUser) {
        res.status(400);
        throw new Error("Account already exist, please login");
    }
    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const admin = await Admin.create({
        name,
        adminUsername,
        password: encryptedPassword,
    });

    // Return new user
    res.status(201).json(admin);
});

const signIn = asyncHandler(async (req, res) => {
    const { adminUsername, password } = req.body;

    // Validate user input
    if (!(adminUsername && password)) throw new Error("All inputs are required");

    // Validate if user exist in our database
    const admin = await Admin.findOne({ adminUsername });

    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "24h" });
        admin.password = undefined;
        res.cookie("access_token", token, {
            maxAge: 90 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true, // TODO: In production, set it to true.
        })
            .status(200)
            .json(admin);
        return;
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const signOut = asyncHandler(async (req, res) => {
    res.clearCookie("access_token", { sameSite: "none", secure: true }).status(200).json();
});

export { signUp, signIn, signOut };
