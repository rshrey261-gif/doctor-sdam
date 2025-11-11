// controllers/appointmentController.js
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

// 🩺 Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // ✅ Fix strict string comparison issue (handles slight format differences)
    const slot = doctor.availableSlots.find(
      (s) =>
        s.date?.trim().slice(0, 10) === date?.trim().slice(0, 10) &&
        s.time?.trim().slice(0, 5) === time?.trim().slice(0, 5)
    );

    if (!slot) {
      return res
        .status(400)
        .json({ message: "Slot not available (no matching slot found)" });
    }

    if (slot.isBooked) {
      return res
        .status(400)
        .json({ message: "Slot not available (already booked)" });
    }

    // Mark slot as booked
    slot.isBooked = true;
    await doctor.save();

    // Verify patient
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient)
      return res.status(403).json({ message: "Only patients can book" });

    // Create appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      date,
      time,
      status: "pending",
    });

    // 🔔 Add doctor notification
    doctor.notifications.push({
      type: "appointment",
      message: `New appointment booked by ${req.user.name} on ${date} at ${time}`,
      appointmentId: appointment._id,
      read: false,
      createdAt: new Date(),
    });
    await doctor.save();

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (err) {
    console.error("Error in bookAppointment:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👨‍⚕️ Doctor fetches appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(403).json({ message: "Not authorized" });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(403).json({ message: "Not authorized" });

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

// 👤 Patient fetches appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(403).json({ message: "Not authorized" });

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
