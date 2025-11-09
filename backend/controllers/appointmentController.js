// controllers/appointmentController.js
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

// ---------------------------
// Patient books appointment
// ---------------------------
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // mark slot as booked
    const slot = doctor.availableSlots.find(
      (s) => s.date === date && s.time === time
    );
    if (!slot || slot.isBooked)
      return res.status(400).json({ message: "Slot not available" });
    slot.isBooked = true;
    await doctor.save();

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient)
      return res.status(403).json({ message: "Only patients can book" });

    const appointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      date,
      time,
      status: "pending",
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------
// Doctor views appointments
// ---------------------------
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor)
      return res.status(403).json({ message: "Not authorized as doctor" });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("patientId")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------
// Doctor accepts / rejects
// ---------------------------
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor)
      return res.status(403).json({ message: "Not authorized as doctor" });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    res.json({ message: `Appointment ${status}`, appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------
// Patient views own appointments
// ---------------------------
export const getPatientAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient)
      return res.status(403).json({ message: "Not authorized as patient" });

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate("doctorId")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
