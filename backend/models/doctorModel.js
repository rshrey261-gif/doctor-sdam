// models/doctorModel.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    qualifications: { type: String, required: true },
    experience: { type: Number, required: true },
    bio: { type: String },
    location: { type: String, required: true },
    availableSlots: [
      {
        date: { type: String },
        time: { type: String },
        isBooked: { type: Boolean, default: false },
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
