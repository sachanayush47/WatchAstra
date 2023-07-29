import express from "express";

import {
    signInAdmin,
    signUpAdmin,
    signOutAdmin,
    signUpClient,
    signInClient,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/create-account", signUpAdmin);
router.post("/admin/sign-in", signInAdmin);
router.post("/admin/sign-out", signOutAdmin);

router.post("/client/create-account", signUpClient);
router.post("/client/sign-in", signInClient);

export default router;
