import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";
import Police from "../model/Police.js";

const signUpAdmin = asyncHandler(async (req, res) => {
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

const signInAdmin = asyncHandler(async (req, res) => {
    const { adminUsername, password } = req.body;

    // Validate user input
    if (!(adminUsername && password)) throw new Error("All inputs are required");

    // Validate if user exist in our database
    const admin = await Admin.findOne({ adminUsername });

    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "30d" });
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

const signOutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("access_token", { sameSite: "none", secure: true }).status(200).json();
});

// @desc    Registers policeman
// @route   POST /api/auth/client/create-account
// @access  Private
const signUpClient = asyncHandler(async (req, res) => {
    const { name, policeUsername, key, phone } = req.body;

    if (!(name && policeUsername && key && phone)) {
        res.status(400);
        throw new Error("All inputs are required");
    }

    const police = await Police.findOne({ policeUsername });
    if (police) {
        res.status(409);
        throw new Error("Policeman was already registered");
    }

    const newPolice = await Police.create({ name, policeUsername, key, phone });
    res.status(200).json(newPolice);
});

// @desc    Registers policeman
// @route   POST /api/auth/client/create-account
// @access  Private
const signInClient = asyncHandler(async (req, res) => {
    const { policeUsername, key } = req.body;

    if (!(policeUsername && key)) {
        res.status(400);
        throw new Error("All inputs are required");
    }

    const police = await Police.findOne({ policeUsername, key });
    if (!police) {
        res.status(404);
        throw new Error("Invalid credentials");
    }

    res.status(200).json(true);
});

export { signUpAdmin, signInAdmin, signOutAdmin, signUpClient, signInClient };
