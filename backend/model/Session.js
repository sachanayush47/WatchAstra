import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        geoFencing: {
            type: [Number],
            default: [],
            required: true,
        },
        status: {
            type: String,
            default: "",
        },
        police: {
            type: [
                {
                    pid: String,
                    name: String,
                    phone: Number,
                    currLocation: { lat: Number, long: Number },
                    allCordinates: [{ lat: Number, long: Number }],
                    status: String,
                    lastUpdated: Date,
                    entry: Date,
                    exit: Date,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
