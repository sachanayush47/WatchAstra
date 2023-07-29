import asyncHandler from "express-async-handler";
import Admin from "../model/Admin.js";
import Police from "../model/Police.js";
import Session from "../model/Session.js";

const verifyPoliceman = asyncHandler(async (policeUsername, key) => {
    const police = await Police.findOne({ policeUsername, key });
    if (!police) return { isValid: false };
    return { isValid: true, police };
});

// @desc    Creates a new session(Bandobust)
// @route   POST /api/admin/create-session
// @access  Private
const createSession = asyncHandler(async (req, res) => {
    const isActiveBandobust = await Session.findOne({
        adminUsername: req.admin.adminUsername,
        status: 1,
    });
    if (isActiveBandobust) {
        res.status(400);
        throw new Error("Already a active session");
    }

    const { geoFencing, startDateTime, endDateTime, bandobustName, center } = req.body;

    if (!(geoFencing && startDateTime && endDateTime && bandobustName && center)) {
        res.status(400);
        throw new Error("All inputs required");
    }

    const newSession = await Session.create({
        adminUsername: req.admin.adminUsername,
        geoFencing,
        status: 1,
        startDateTime,
        endDateTime,
        bandobustName,
        center,
    });

    res.status(201).json(newSession);
});

// @desc    Register policeman entry and exit date and time
// @route   POST /api/admin/nfc-attendence
// @access  Private
const NfcAttendence = asyncHandler(async (req, res) => {
    const { adminUsername, policeUsername, key } = req.body;

    res.status(400);
    if (!(adminUsername && policeUsername && key)) {
        throw new Error("All inputs are required");
    }

    // Check for active bandobust
    const isActiveBandobust = await Session.findOne({ adminUsername, status: 1 });
    if (!isActiveBandobust) {
        throw new Error("Invalid admin username or no active bandobust");
    }

    // Check for valid policeman
    const isPolicemanValid = await verifyPoliceman(policeUsername, key);
    if (!isPolicemanValid.isValid) {
        throw new Error("Invalid police username or key");
    }

    const policeArray = isActiveBandobust.police;
    const policeDocumentIndex = policeArray.findIndex((i) => i.policeUsername == policeUsername);
    const policeDocument = policeArray[policeDocumentIndex];

    if (policeDocument) {
        if (policeDocument.entry) {
            if (policeDocument.exit) {
                throw new Error("Your duty was already completed");
            } else {
                policeDocument.exit = Date.now();
                policeDocument.lastUpdated = Date.now();
            }
        } else {
            policeDocument.entry = Date.now();
            policeDocument.lastUpdated = Date.now();
            policeDocument.name = isPolicemanValid.police.name;
            policeDocument.phone = isPolicemanValid.police.phone;
        }
    } else {
        const newPoliceDocument = {
            policeUsername: policeUsername,
            name: isPolicemanValid.police.name,
            phone: isPolicemanValid.police.phone,
            lastUpdated: Date.now(),
            entry: Date.now(),
            status: "Verified",
        };

        policeArray.push(newPoliceDocument);
    }

    const updatedResult = await isActiveBandobust.save();
    res.status(200).json(updatedResult);
});

// @desc    Updates policeman geolocation coming from android app
// @route   PUT /api/admin/--------
// @access  Private
const updatePoliceLocation = asyncHandler(async (req, res) => {
    const { adminUsername, policeUsername, key, location } = req.body;

    if (!(adminUsername && policeUsername && key && location)) {
        res.status(400);
        throw new Error("All inputs are required");
    }

    // Check for active bandobust
    const isActiveBandobust = await Session.findOne({ adminUsername, status: 1 });
    if (!isActiveBandobust) {
        throw new Error("Invalid admin username or no active bandobust");
    }

    // Check for valid policeman
    const isPolicemanValid = await verifyPoliceman(policeUsername, key);
    if (!isPolicemanValid.isValid) {
        res.status(400);
        throw new Error("Invalid police username or key");
    }

    const policeArray = isActiveBandobust.currSession.police;
    const policeDocumentIndex = policeArray.findIndex((i) => i.policeUsername == policeUsername);
    const policeDocument = policeArray[policeDocumentIndex];

    if (!policeDocument || !policeDocument.entry) {
        res.status(400);
        throw new Error("Please tap on NFC");
    }

    if (policeDocument.exit) {
        res.status(400);
        throw new Error("Your duty was already completed");
    }

    policeDocument.currLocation = location;
    policeDocument.allLocation.push(location);
    policeDocument.lastUpdated = Date.now();

    await isActiveBandobust.save();
    res.status(200).json({ message: "Ok" });
});

// @desc    Closes the current active session(Bandobust)
// @route   PUT /api/admin/
// @access  Private
const terminateCurrentSession = asyncHandler(async (req, res) => {
    // Check for active bandobust
    const isActiveBandobust = await Session.findOne({
        adminUsername: req.admin.adminUsername,
        status: 1,
    });
    if (!isActiveBandobust) {
        res.status(400);
        throw new Error("Bad request, no active bandobust");
    }

    isActiveBandobust.status = 0;
    await isActiveBandobust.save();
    res.status(200).json({ message: "Ok" });
});

// @desc    Get admin dashboard details
// @route   GET /api/admin/dashboard-details
// @access  Private
const getDashboardDetails = asyncHandler(async (req, res) => {
    const session = await Session.findOne({ adminUsername: req.admin.adminUsername, status: 1 });

    const data = {
        name: req.admin.name,
        adminUsername: req.admin.adminUsername,
        session: session ? session : null,
    };

    res.status(200).json(data);
});

// @desc    Get previus session info
// @route   GET /api/admin/session-info/:sid
// @access  Private
const getSessionInfo = asyncHandler(async (req, res) => {
    const { sid } = req.params;

    const session = await Session.findById(sid);

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
// @route   GET /api/admin/current-session
// @access  Private
const getCurrSessionInfo = asyncHandler(async (req, res) => {
    res.status(400);
    // Check for active bandobust
    const isActiveBandobust = await Session.findOne({
        adminUsername: req.admin.adminUsername,
        status: 1,
    });
    if (!isActiveBandobust) {
        throw new Error("No active bandobust");
    }

    res.status(200).json(isActiveBandobust);
});

export {
    createSession,
    NfcAttendence,
    getDashboardDetails,
    getCurrSessionInfo,
    getSessionInfo,
    terminateCurrentSession,
    updatePoliceLocation,
};
