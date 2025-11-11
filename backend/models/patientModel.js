// models/patientModel.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: Number,
    gender: String,
    medicalCardId: String,
    medicalHistory: [
      {
        date: String,
        notes: String,
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
      },
    ],
    prescriptions: [
      {
        prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
        date: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
