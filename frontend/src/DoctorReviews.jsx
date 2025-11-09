import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import "./DoctorReviews.css";

function DoctorReviews() {
  const { state } = useLocation();
  const doctorId = state?.doctorId;
  const doctorName = state?.doctorName || "Doctor";
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/reviews/${doctorId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/reviews", { doctorId, rating, comment });
      setMessage(res.data.message);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting review");
    }
  };

  useEffect(() => {
    if (doctorId) fetchReviews();
  }, [doctorId]);

  return (
    <div className="reviews-container">
      <h2>Reviews for {doctorName}</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="0">Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit Review</button>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="review-list">
        <h3>What others said:</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div className="review-card" key={rev._id}>
              <p>
                <b>⭐ {rev.rating}</b> — {rev.comment}
              </p>
              <p className="review-date">
                {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorReviews;
