// models/patientModel.js
import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
  condition: String,
  treatment: String,
  date: String,
});

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: { type: Number },
    gender: { type: String },
    medicalHistory: [medicalHistorySchema],
    medicalCardId: { type: String }, // we’ll generate later
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
