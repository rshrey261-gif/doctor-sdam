// models/doctorModel.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String },
    qualifications: { type: String },
    experience: { type: Number },
    bio: { type: String, default: "" },
    location: { type: String },
    availableSlots: [
      {
        date: String,
        time: String,
        isBooked: { type: Boolean, default: false },
      },
    ],
    notifications: [
      {
        type: { type: String },
        message: String,
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
