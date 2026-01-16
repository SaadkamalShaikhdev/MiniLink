import mongoose from "mongoose";


const urlSchema = new mongoose.Schema(
  {
    email:{type: String, required: false},
    url: {
      type: String,
      required: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Url || mongoose.model("Url", urlSchema);