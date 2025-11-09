// controllers/reviewController.js
import Review from "../models/reviewModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/appointmentModel.js";

// @desc  Add review for a doctor
// @route POST /api/reviews
// @access Private (patient)
export const addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(403).json({ message: "Only patients can review" });

    // Check if patient had a completed appointment with the doctor
    const appointment = await Appointment.findOne({
      doctorId,
      patientId: patient._id,
      status: "completed",
    });

    if (!appointment)
      return res
        .status(403)
        .json({ message: "You can review only after completing an appointment" });

    // Prevent duplicate reviews
    const alreadyReviewed = await Review.findOne({
      doctorId,
      patientId: patient._id,
    });
    if (alreadyReviewed)
      return res.status(400).json({ message: "You already reviewed this doctor" });

    const review = await Review.create({
      doctorId,
      patientId: patient._id,
      rating: Number(rating),
      comment,
    });

    // Update doctor’s average rating
    const reviews = await Review.find({ doctorId });
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    const doctor = await Doctor.findById(doctorId);
    doctor.rating = avgRating.toFixed(1);
    doctor.numReviews = reviews.length;
    await doctor.save();

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all reviews for a doctor
// @route GET /api/reviews/:doctorId
// @access Public
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate("patientId", "userId")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
