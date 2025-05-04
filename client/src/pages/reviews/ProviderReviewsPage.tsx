import React, { useEffect, useState, useContext } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Adjust this import if needed

interface Review {
  seekerId: any;
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  service: string;
  seekerName: string;
}

export function ProviderReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reviews/provider/${user.id}`
        );
        const data = await res.json();
        //console.log(data);
        // For each review, fetch the seeker's name
        const enrichedReviews = await Promise.all(
          data.reviews.map(async (review: Review) => {
            //console.log(review.seekerId);
            try {
              const res = await fetch(
                `http://localhost:5000/api/profile/seeker/${review.seekerId}`
              );
              const seekerData = await res.json();
              return {
                ...review,
                seekerName: seekerData.name || "Unknown",
              };
              console.log(review);
            } catch (err) {
              console.error("Failed to fetch seeker:", err);
              return {
                ...review,
                seekerName: "Unknown",
              };
            }
          })
        );

        setReviews(enrichedReviews);

        if (enrichedReviews.length > 0) {
          const avg =
            enrichedReviews.reduce(
              (acc: number, r: Review) => acc + r.rating,
              0
            ) / enrichedReviews.length;
          setAverageRating(Number(avg.toFixed(1)));
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    if (user?.id) {
      fetchReviews();
    }
  }, [user]);

  const getStarPercentage = (star: number) => {
    const total = reviews.length;
    if (total === 0) return 0;
    const count = reviews.filter((r) => r.rating === star).length;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          Reviews & Ratings
        </h1>

        {/* Rating Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {averageRating || "0.0"}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 text-yellow-400 ${
                      i < Math.round(averageRating) ? "fill-current" : ""
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Based on {reviews.length} reviews
              </p>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 w-8">
                      {rating} star
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${getStarPercentage(rating)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 w-12">
                      {getStarPercentage(rating)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
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
                        {review.seekerName}
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
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
