import asyncHandler from "express-async-handler";
import Admin from "../model/Admin.js";
import Police from "../model/Police.js";
import Session from "../model/Session.js";

const verifyPoliceman = asyncHandler(async (policeUsername, key) => {
    const police = await Police.findOne({ policeUsername });
    if (!police) return false;

    if (police.key == key) return true;
    return false;
});

// @desc    Creates a new session(Bandobust)
// @route   POST /api/admin/create-session
// @access  Private
const createSession = asyncHandler(async (req, res) => {
    if (req.admin.currSession) {
        res.status(400);
        throw new Error("Already a active session");
    }

    const { geoFencing, startDateTime, endDateTime, bandobustName, center } = req.body;

    if (!(geoFencing && startDateTime && endDateTime && bandobustName && center)) {
        res.status(400);
        throw new Error("All inputs required");
    }

    const updatedResult = await Admin.findByIdAndUpdate(
        { _id: req.admin.id },
        {
            currSession: {
                geoFencing,
                status: "active",
                startDateTime,
                endDateTime,
                bandobustName,
                center,
            },
        },
        { new: true }
    ).select("-password");

    res.status(200).json(updatedResult);
});

// @desc    Register policeman entry and exit date and time
// @route   POST /api/admin/nfc-attendence
// @access  Private
const NfcAttendence = asyncHandler(async (req, res) => {
    const { adminUsername, policeUsername, name, phone, key } = req.body;

    if (!(adminUsername && policeUsername && name && phone && key)) {
        res.status(400);
        throw new Error("All inputs are required");
    }

    const admin = await Admin.findOne({ adminUsername });

    if (!admin) {
        res.status(400);
        throw new Error("Invalid admin username");
    }

    if (!admin.currSession) {
        res.status(400);
        throw new Error("No active session is there");
    }

    const isPolicemanValid = await verifyPoliceman(policeUsername, key);

    if (!isPolicemanValid) {
        res.status(400);
        throw new Error("Invalid police username or key");
    }

    const policeArray = admin.currSession.police;
    const policeDocumentIndex = policeArray.findIndex((i) => i.policeUsername == policeUsername);
    const policeDocument = policeArray[policeDocumentIndex];

    if (policeDocument) {
        if (policeDocument.entry) {
            if (policeDocument.exit) {
                res.status(400);
                throw new Error("Your duty was already completed");
            } else {
                policeDocument.exit = Date.now();
                policeDocument.lastUpdated = Date.now();
            }
        } else {
            policeDocument.entry = Date.now();
            policeDocument.lastUpdated = Date.now();
        }
    } else {
        const newPoliceDocument = {
            policeUsername: policeUsername,
            name: name,
            phone: phone,
            lastUpdated: Date.now(),
            entry: Date.now(),
            status: "Verified",
        };

        policeArray.push(newPoliceDocument);
    }

    const updatedResult = await admin.save();
    res.status(200).json(updatedResult);
});

// @desc    Registers policeman
// @route   POST /api/admin/register-policeman
// @access  Private
const registerPoliceman = asyncHandler(async (req, res) => {
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

// @desc    Updates policeman geolocation coming from android app
// @route   PUT /api/admin/--------
// @access  Private
const updatePoliceLocation = asyncHandler(async (req, res) => {
    // TODO:
});

// @desc    Closes the current active session(Bandobust)
// @route   PUT /api/admin/
// @access  Private
const terminateCurrentSession = asyncHandler(async (req, res) => {
    // TODO:
});

// @desc    Get admin dashboard details
// @route   GET /api/admin/dashboard-details
// @access  Private
const getDashboardDetails = asyncHandler(async (req, res) => {
    const data = {
        name: req.admin.name,
        adminUsername: req.admin.adminUsername,
        session: req.admin.session,
    };

    res.status(200).json(data);
});

// @desc    Get previus session info
// @route   GET /api/admin/session-info/:sid
// @access  Private
const getSessionInfo = asyncHandler(async (req, res) => {
    const { sid } = req.params;

    const session = await Session.findById(sessionId);

    if (!sid) {
        res.status(400);
        throw new Error("Invalid session ID");
    }

    const isAdminAuthorised = req.admin.session.includes(sid);
    if (!isAdminAuthorised) {
        res.status(401);
        throw new Error("You are not authorized to access this information.");
    }

    res.status(200).json(session);
});

// @desc    Get current session info
// @route   GET /api/admin/
// @access  Private
const getCurrSessionInfo = asyncHandler(async (req, res) => {
    if (!req.admin.currSession) {
        res.status(400);
        throw new Error("No active session");
    }

    res.status(200).json(req.admin.currSession);
});

export {
    createSession,
    NfcAttendence,
    registerPoliceman,
    getDashboardDetails,
    getCurrSessionInfo,
    getSessionInfo,
};
