import express from "express";

import { verifyAdmin } from "../middleware/authHandler.js";
import {
    createSession,
    getCurrSessionInfo,
    getDashboardDetails,
    getSessionInfo,
    NfcAttendence,
    terminateCurrentSession,
    updatePoliceLocation,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-session", verifyAdmin, createSession);
router.post("/nfc-attendence", NfcAttendence);

router.get("/dashboard-details", verifyAdmin, getDashboardDetails);
router.get("/session-info/:sid", verifyAdmin, getSessionInfo);
router.get("/current-session", verifyAdmin, getCurrSessionInfo);

router.put("/terminate-current-session", verifyAdmin, terminateCurrentSession);
router.put("/update-location", updatePoliceLocation);

export default router;
