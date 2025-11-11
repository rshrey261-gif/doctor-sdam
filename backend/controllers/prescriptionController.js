// controllers/prescriptionController.js
import Prescription from "../models/prescriptionModel.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧾 Doctor creates prescription (with PDF + DB updates)
export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;

    // 🔍 Validate appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // 🔍 Validate doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor)
      return res
        .status(403)
        .json({ message: "Only doctors can create prescriptions" });

    // 🔍 Find patient
    const patient = await Patient.findById(appointment.patientId);
    if (!patient)
      return res.status(404).json({ message: "Patient not found" });

    // 🧾 Create prescription in DB
    const prescription = await Prescription.create({
      appointmentId,
      doctorId: doctor._id,
      patientId: patient._id,
      medicines,
      notes,
    });

    // 📄 Generate PDF
    const pdfDir = path.join(__dirname, "../prescriptions");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const pdfPath = path.join(
      pdfDir,
      `prescription_${prescription._id}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text("Medical Prescription", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Doctor: ${req.user.name}`);
    doc.text(`Patient ID: ${patient._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.text("Medicines:");
    medicines?.forEach((m, i) =>
      doc.text(`${i + 1}. ${m.name} - ${m.dosage} - ${m.duration}`)
    );

    doc.moveDown();
    doc.text(`Notes: ${notes || "N/A"}`);
    doc.end();

    prescription.pdfLink = `/prescriptions/prescription_${prescription._id}.pdf`;
    await prescription.save();

    // 🩺 Update appointment + patient records
    appointment.status = "completed";
    await appointment.save();

    patient.medicalHistory.push({
      date: new Date().toISOString(),
      notes,
      doctorId: doctor._id,
      prescriptionId: prescription._id,
    });

    patient.prescriptions.push({
      prescriptionId: prescription._id,
      date: new Date().toISOString(),
    });

    await patient.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (err) {
    console.error("Error creating prescription:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Patient fetches their prescriptions
export const getPatientPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient)
      return res
        .status(403)
        .json({ message: "Only patients can view prescriptions" });

    const prescriptions = await Prescription.find({ patientId: patient._id })
      .populate("doctorId", "userId")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ message: err.message });
  }
};
