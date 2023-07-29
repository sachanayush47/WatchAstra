import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        adminUsername: {
            type: String,
            required: true,
        },
        geoFencing: {
            type: [[]],
            default: [[]],
            required: true,
        },
        center: {
            type: [Number],
            default: [],
            required: true,
        },

        // 1 - Active, 0 - Inactive
        status: {
            type: Number,
            default: 1,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        bandobustName: {
            type: String,
            required: true,
        },
        police: {
            type: [
                {
                    policeUsername: String,
                    name: String,
                    phone: Number,
                    currLocation: [],
                    allLocation: [[]],
                    status: String,
                    lastUpdated: Date,
                    entry: Date,
                    exit: Date,
                    credits: Number,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
