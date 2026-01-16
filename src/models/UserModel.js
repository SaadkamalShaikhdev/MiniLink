import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: String,
    provider: {type: String, default: "google"},


},{timestamps: true})

export default mongoose.models.User || mongoose.model("User", userSchema);