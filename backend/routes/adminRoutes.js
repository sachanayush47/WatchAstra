import express from "express";

import { verifyAdmin } from "../middleware/authHandler.js";
import {
    createSession,
    getCurrSessionInfo,
    getDashboardDetails,
    getSessionInfo,
    NfcAttendence,
    registerPoliceman,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-session", verifyAdmin, createSession);
router.post("/nfc-attendence", NfcAttendence);
router.post("/register-policeman", verifyAdmin, registerPoliceman);

router.get("/dashboard-details", verifyAdmin, getDashboardDetails);
router.get("/session-info/:sid", verifyAdmin, getSessionInfo);
router.get("/current-session", verifyAdmin, getCurrSessionInfo);
router.get("/hi", (req, res) => res.send("hiiiiiii"));

export default router;
