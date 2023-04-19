import mongoose from "mongoose";

const policeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        policeUsername: {
            type: String,
            required: true,
            unique: true,
        },
        key: {
            type: String,
            required: true,
        },
        totalCredits: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Police = mongoose.model("Police", policeSchema);
export default Police;
