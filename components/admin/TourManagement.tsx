'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import SubmittedTourBookings from "./SubmittedTourBookings";

interface Tour {
  _id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  capacity: number;
  booked: number;
  rating: number;
  price: number;
  status: "Active" | "Full" | "Inactive";
  image: string;
  category: "Cultural" | "Adventure" | "Wildlife";
  vehicle: string;
  itinerary: string;
  highlights: string[];
}

interface FormData {
  name: string;
  description: string;
  location: string;
  duration: string;
  capacity: string;
  price: string;
  status: "Active" | "Full" | "Inactive";
  image: string;
  category: "Cultural" | "Adventure" | "Wildlife";
  vehicle: string;
  itinerary: string;
  highlights: string;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  location: "",
  duration: "",
  capacity: "",
  price: "",
  status: "Active",
  image: "",
  category: "Cultural",
  vehicle: "",
  itinerary: "",
  highlights: "",
};

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Full: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch tours on mount
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/tours");
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to fetch tours");
      }

      setTours(data.tours || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter tours by search query
  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      console.log('📤 Sending form data:', formData);

      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error("Server error: Invalid response format");
      }

      const data = await res.json();
      console.log('📥 Response:', data);

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to create tour");
      }

      // Success - close modal and refresh list
      setIsModalOpen(false);
      setFormData(initialFormData);
      fetchTours();
    } catch (err) {
      console.error('❌ Form submission error:', err);
      setFormError(
        err instanceof Error ? err.message : "Failed to create tour",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Open modal
  const openModal = () => {
    setFormData(initialFormData);
    setFormError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Submitted Tour Bookings Section */}
      <SubmittedTourBookings />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tour Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage tour packages and excursions
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]"
        >
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No tours found. Create your first tour!
          </p>
        </div>
      )}

      {/* Tours Grid */}
      {!loading && !error && filteredTours.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTours.map((tour, i) => (
            <motion.div
              key={tour._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
            >
              {/* Tour Image */}
              {tour.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{tour.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {tour.location}
                      </span>
                    </div>
                  </div>
                  <button className="text-slate-600 hover:text-slate-300 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tour.booked}/{tour.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    {tour.rating.toFixed(1)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${tour.capacity > 0 ? (tour.booked / tour.capacity) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[tour.status] || statusColors.Inactive}`}
                  >
                    {tour.status}
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${tour.price}
                    <span className="text-xs text-slate-500 font-normal">
                      /person
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Tour Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">
                  Add New Tour
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {formError}
                  </div>
                )}

                {/* Tour Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Tour Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., City Heritage Walk"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Describe the tour experience..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* Location & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Old Town"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 3 hours"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="e.g., 15"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 55"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  >
                    <option value="Cultural">🏛️ Cultural</option>
                    <option value="Adventure">🧗 Adventure</option>
                    <option value="Wildlife">🐘 Wildlife</option>
                  </select>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleInputChange}
                    placeholder="e.g., Air-conditioned Van, Safari Jeep, Bus"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>

                {/* Itinerary */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Itinerary
                  </label>
                  <textarea
                    name="itinerary"
                    value={formData.itinerary}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="07:00 Hotel Pickup → 09:00 Sigiriya → 13:00 Lunch → 15:00 Dambulla Cave → 18:00 Return"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Highlights <span className="text-slate-500 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleInputChange}
                    placeholder="Temple visit, Local lunch, Guided tour, Photo stops"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Each highlight separated by a comma</p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Full">Full</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Image URL
                    </span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Paste Cloudinary URL or any image link
                  </p>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Tour
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
