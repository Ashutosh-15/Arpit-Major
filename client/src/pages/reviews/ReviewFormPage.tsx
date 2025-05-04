import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ReviewFormPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch existing review on load
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reviews/get-reviews/${bookingId}`
        );
        if (res.ok) {
          const review = await res.json();
          setRating(review.rating);
          setComment(review.comment);
          setIsEditMode(true);
        }
      } catch (err) {
        console.log("No existing review");
      }
    };

    fetchReview();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${bookingId}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Submission failed");
      }

      setSubmitted(true);
      setTimeout(() => navigate("/seeker/bookings"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 text-green-600 font-semibold">
        {isEditMode ? "Review updated!" : "Review submitted!"} Redirecting...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Your Review" : "Leave a Review"}
      </h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`w-8 h-8 rounded-full ${
                  rating >= star ? "bg-yellow-400" : "bg-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
