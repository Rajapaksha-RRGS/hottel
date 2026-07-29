'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import {
  BedDouble,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Wifi,
  AirVent,
  Tv,
  Bath,
  X,
  Loader2,
  Waves,
  Wine,
  Image as ImageIcon,
  Trash2,
  Edit,
} from "lucide-react";

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  status: string;
  pricePerNight: number;
  amenities: string[];
  maxOccupancy: number;
  description?: string;
  images: string[];
  lastCleaned: Date;
}

const statusColors: Record<string, string> = {
  Available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Occupied: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Cleaning: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Maintenance: "bg-red-500/15 text-red-400 border-red-500/30",
};

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  WiFi: Wifi,
  wifi: Wifi,
  TV: Tv,
  tv: Tv,
  AC: AirVent,
  ac: AirVent,
  Bath: Bath,
  bath: Bath,
  "Sea View": Waves,
  "Mini Bar": Wine,
};

const roomTypes = ["Standard", "Deluxe", "Beach-Cabana", "Family-Suite"];
const roomStatuses = ["Available", "Occupied", "Cleaning", "Maintenance"];
const amenitiesList = ["AC", "Free WiFi", "TV", "Sea View", "Mini Bar", "Bath"];

// Default placeholder image
const defaultRoomImage = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Standard",
    status: "Available",
    pricePerNight: "",
    maxOccupancy: "2",
    amenities: [] as string[],
    description: "",
    images: [] as string[],
  });

  // Image URL input state
  const [imageUrl, setImageUrl] = useState("");

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/Room");
      const data = await response.json();

      if (data.ok) {
        setRooms(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch rooms");
      }
    } catch (err) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Open modal (for Add or Edit)
  const handleOpenModal = (roomToEdit?: Room) => {
    if (roomToEdit) {
      setEditingRoom(roomToEdit);
      setFormData({
        roomNumber: roomToEdit.roomNumber || "",
        type: roomToEdit.type || "Standard",
        status: roomToEdit.status || "Available",
        pricePerNight: roomToEdit.pricePerNight?.toString() || "",
        maxOccupancy: roomToEdit.maxOccupancy?.toString() || "2",
        amenities: roomToEdit.amenities || [],
        description: roomToEdit.description || "",
        images: roomToEdit.images || [],
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: "",
        type: "Standard",
        status: "Available",
        pricePerNight: "",
        maxOccupancy: "2",
        amenities: [],
        description: "",
        images: [],
      });
    }
    setImageUrl("");
    setIsModalOpen(true);
    dialogRef.current?.showModal();
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    dialogRef.current?.close();
    setEditingRoom(null);
    setFormData({
      roomNumber: "",
      type: "Standard",
      status: "Available",
      pricePerNight: "",
      maxOccupancy: "2",
      amenities: [],
      description: "",
      images: [],
    });
    setImageUrl("");
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Add image URL to list
  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  // Remove image from list
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle Delete Room
  const handleDeleteRoom = async (id: string, roomNumber: string) => {
    if (!confirm(`Are you sure you want to delete Room ${roomNumber}?`)) return;

    try {
      const res = await fetch(`/api/admin/Room?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.ok) {
        fetchRooms();
      } else {
        alert(data.message || "Failed to delete room");
      }
    } catch (err) {
      alert("Failed to delete room");
    }
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // If user entered image URL into input but didn't click '+', append it now
    let finalImages = [...formData.images];
    if (imageUrl.trim() && !finalImages.includes(imageUrl.trim())) {
      finalImages.push(imageUrl.trim());
    }

    try {
      const method = editingRoom ? "PUT" : "POST";
      const bodyPayload = {
        ...(editingRoom ? { _id: editingRoom._id } : {}),
        ...formData,
        images: finalImages,
        pricePerNight: Number(formData.pricePerNight),
        maxOccupancy: Number(formData.maxOccupancy),
      };

      const response = await fetch("/api/admin/Room", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (data.ok) {
        handleCloseModal();
        fetchRooms();
      } else {
        alert(data.message || `Failed to ${editingRoom ? "update" : "create"} room`);
      }
    } catch (err) {
      alert(`Failed to ${editingRoom ? "update" : "create"} room`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter rooms by search term
  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Room Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage and monitor all hotel rooms
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="ml-3 text-slate-400">Loading rooms...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRooms}
            className="text-amber-500 hover:text-amber-400 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredRooms.length === 0 && (
        <div className="text-center py-20">
          <BedDouble className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No rooms found</p>
          <button
            onClick={() => handleOpenModal()}
            className="text-amber-500 hover:text-amber-400 underline"
          >
            Add your first room
          </button>
        </div>
      )}

      {/* Room Grid */}
      {!loading && !error && filteredRooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room, i) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
            >
              {/* Room Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.images?.[0] || defaultRoomImage}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Status Badge on Image */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${statusColors[room.status] || statusColors["Available"]}`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => handleOpenModal(room)}
                    className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-colors"
                    title="Edit Room"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                    className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-red-400 border border-slate-700/60 transition-colors"
                    title="Delete Room"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price on Image */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    ${room.pricePerNight}
                    <span className="text-xs text-slate-300 font-normal">
                      /night
                    </span>
                  </span>
                </div>
              </div>

              {/* Room Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-lg">
                      Room {room.roomNumber}
                    </p>
                    <p className="text-sm text-slate-500">{room.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <BedDouble className="w-4 h-4" />
                    <span className="text-xs">
                      {room.maxOccupancy} {room.maxOccupancy > 1 ? "Guests" : "Guest"}
                    </span>
                  </div>
                </div>

                {/* Amenities & Image Count */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
                  {room.amenities.slice(0, 4).map((a) => {
                    const Icon = amenityIcons[a];
                    return Icon ? (
                      <div
                        key={a}
                        className="p-1.5 rounded-lg bg-slate-800/40"
                        title={a}
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ) : null;
                  })}
                  {room.amenities.length > 4 && (
                    <span className="text-xs text-slate-500">
                      +{room.amenities.length - 4} more
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-1 text-slate-400">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-400">
                      {room.images?.length || 0} {room.images?.length === 1 ? 'img' : 'imgs'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Room Modal */}
      <dialog
        ref={dialogRef}
        className="bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        onClose={handleCloseModal}
      >
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : "Add New Room"}
            </h3>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Room Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roomNumber: e.target.value,
                  }))
                }
                placeholder="e.g., 101, A-201"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>

            {/* Type & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Room Type <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                >
                  {roomStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Occupancy Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Price per Night ($) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pricePerNight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pricePerNight: e.target.value,
                    }))
                  }
                  placeholder="e.g., 150"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Max Occupancy
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxOccupancy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxOccupancy: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Room Images (Paste URL & click + or Save)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)..."
                  className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={!imageUrl.trim()}
                  className="px-4 py-2.5 bg-slate-800 border border-slate-700/60 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-video rounded-lg overflow-hidden border border-slate-700/60"
                    >
                      <img
                        src={img}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultRoomImage;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500/80 rounded text-[10px] font-medium text-slate-900">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                First image will be used as the main display image in rooms list
              </p>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      formData.amenities.includes(amenity)
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Room description..."
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingRoom ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {editingRoom ? "Save Changes" : "Add Room"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

