import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Review {
  _id: string;
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface EnrichedReview extends Review {
  providerName: string;
  service: string;
}

export function SeekerReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedReview, setEditedReview] = useState<{ rating: number; comment: string }>({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchSeekerReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/seeker/${user.id}`);
        const data = await res.json();

        if (Array.isArray(data.reviews)) {
          const enrichedReviews = await Promise.all(
            data.reviews.map(async (review: Review) => {
              try {
                const [providerRes, bookingRes] = await Promise.all([
                  fetch(`http://localhost:5000/api/profile/provider/${review.providerId}`),
                  fetch(`http://localhost:5000/api/bookings/${review.bookingId}`)
                ]);
                const providerData = await providerRes.json();
                const bookingData = await bookingRes.json();

                return {
                  ...review,
                  providerName: providerData.name,
                  service: bookingData.services?.[0] || "N/A"
                };
              } catch (err) {
                console.error("Error enriching review:", err);
                return { ...review, providerName: "Unknown", service: "N/A" };
              }
            })
          );

          setReviews(enrichedReviews);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (err) {
        console.error("Failed to fetch seeker reviews:", err);
      }
    };

    if (user?.id) {
      fetchSeekerReviews();
    }
  }, [user]);

  const handleEdit = (review: EnrichedReview) => {
    setEditMode(review._id);
    setEditedReview({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (reviewId: string, bookingId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedReview),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, ...editedReview } : r
          )
        );
        setEditMode(null);
      } else {
        console.error("Failed to update review");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Your Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You haven’t submitted any reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={`https://i.pravatar.cc/48?img=${index + 1}`}
                  alt="Reviewer"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold dark:text-white">
                        {review.providerName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 text-yellow-400 ${
                                i < review.rating ? "fill-current" : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {review.service}
                    </div>
                  </div>

                  {editMode === review._id ? (
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 cursor-pointer ${
                              editedReview.rating >= star
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              setEditedReview((prev) => ({
                                ...prev,
                                rating: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <textarea
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        value={editedReview.comment}
                        onChange={(e) =>
                          setEditedReview((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(review._id, review.bookingId)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="px-4 py-2 border rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {review.comment}
                      </p>
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
