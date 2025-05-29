import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import type { FormEvent } from "react";

interface Product {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  productId: string;
  userId:    string;
  userName:  string;
  rating:    number;
  comment:   string;
  createdAt: string;
}

export default function ReviewPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [loading,  setLoading]  = useState(true);

  // form state
  const [productId, setProductId] = useState("");
  const [rating,    setRating]    = useState<number>(5);
  const [comment,   setComment]   = useState("");
  const [error,     setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          axios.get<Product[]>("http://localhost:5000/api/products/all"),
          axios.get<Review[]>("http://localhost:5000/api/reviews/all"),
        ]);
        setProducts(pRes.data);
        setReviews(rRes.data);
        if (pRes.data.length) setProductId(pRes.data[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading reviews…</p>;

  // create new review
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("You must be logged in to leave a review.");
      return;
    }
    try {
      const payload = {
        productId,
        userId:   user.userId,
        userName: user.name,
        rating,
        comment,
      };
      const res = await axios.post<Review>(
        "http://localhost:5000/api/reviews/add",
        payload
      );
      setReviews([res.data, ...reviews]);
      setRating(5);
      setComment("");
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add review.");
    }
  };

  // delete review
  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <section className="bg-gray-800 p-6 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block mb-1">Product</label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700"
            >
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block mb-1">Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={e => setRating(+e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Comment</label>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your review…"
              required
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-4 mt-2 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
          >
            Post Review
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">All Reviews</h2>
          <div className="space-y-4">
        {reviews.map(r => {
          // find the product name for this review
          const prod = products.find(p => p._id === r.productId);
            return (
              <div
                key={r._id}
                className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                <p className="text-sm text-gray-500 italic mb-1">
                Product: {prod ? prod.name : "Unknown"}
                </p>

                <p className="text-gray-900 font-semibold">{r.userName}</p>
                <p className="text-sm text-gray-700">
                  ({r.rating}/5) — {r.comment}
                </p>
              </div>
                <button
                  onClick={() => deleteReview(r._id)}
                  className="mt-2 md:mt-0 md:ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded self-start">
                  Delete
                </button>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
