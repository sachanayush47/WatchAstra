import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        geoFencing: {
            type: [[]],
            default: [[]],
        },
        center: {
            type: [Number],
            default: [],
            required: true,
        },
        status: {
            type: String,
            default: "",
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
                    location: { lat: Number, long: Number },
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

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        adminUsername: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        currSession: {
            type: sessionSchema,
            default: undefined,
        },
        session: {
            type: [mongoose.SchemaTypes.ObjectId],
            ref: "Session",
            default: [],
        },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
