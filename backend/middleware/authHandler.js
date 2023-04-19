import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../model/Admin.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(401);
        throw new Error("It appears that you are not logged in.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) throw new Error();
        else req.admin = admin;
    } catch (error) {
        res.status(403);
        throw new Error("Invalid token, please logout and login again.");
    }

    next();
});
