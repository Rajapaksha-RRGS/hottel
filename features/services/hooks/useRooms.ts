import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

export interface Room {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  gallery: string[];
  sqft: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  description: string;
  maxGuests: number;
}

export function useRooms() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCheckIn = searchParams.get("checkIn") || "";
  const urlCheckOut = searchParams.get("checkOut") || "";
  const { searchData, setSearchData } = useSearch();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<{
    category: string | null;
    maxPrice: number;
  }>({
    category: null,
    maxPrice: 1000,
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCheckIn, setActiveCheckIn] = useState("");
  const [activeCheckOut, setActiveCheckOut] = useState("");

  const mapRoom = (room: any): Room => {
    const fallbackImage =
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";
    const image = room?.images?.[0] || room?.image || fallbackImage;
    const gallery = room?.images?.length ? room.images : [image];
    return {
      id:
        room._id?.toString?.() ||
        room.id ||
        room.roomNumber ||
        crypto.randomUUID(),
      name: room.name || room.roomNumber || "Luxury Suite",
      category: room.type || room.category || "Suite",
      price: room.pricePerNight || room.price || 0,
      image,
      gallery,
      sqft: room.sqft || 450,
      bedType: room.bedType || "King Bed",
      viewType: room.viewType || "Premium View",
      amenities: room.amenities || ["Wifi", "AC", "Pool"],
      description:
        room.description ||
        "Experience refined comfort with curated amenities and thoughtful details.",
      maxGuests: room.maxOccupancy || room.maxGuests || 2,
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "/api/rooms";
        let checkInDate = "";
        let checkOutDate = "";

        // Prioritize URL parameters, fall back to searchData
        if (urlCheckIn && urlCheckOut) {
          checkInDate = urlCheckIn;
          checkOutDate = urlCheckOut;
          endpoint = `/api/rooms/available?checkIn=${urlCheckIn}&checkOut=${urlCheckOut}`;
          setActiveCheckIn(urlCheckIn);
          setActiveCheckOut(urlCheckOut);
        } else if (searchData && searchData.checkIn && searchData.checkOut) {
          checkInDate = searchData.checkIn;
          checkOutDate = searchData.checkOut;
          endpoint = `/api/rooms/available?checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}`;
          setActiveCheckIn(searchData.checkIn);
          setActiveCheckOut(searchData.checkOut);
        } else {
          setActiveCheckIn("");
          setActiveCheckOut("");
        }

        const res = await fetch(endpoint, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load rooms");
        }

        const roomsPayload = data.rooms || data;
        const mappedRooms = Array.isArray(roomsPayload)
          ? roomsPayload.map(mapRoom)
          : [];

        setRooms(mappedRooms);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchData, urlCheckIn, urlCheckOut]);

  // Filter rooms based on selected filters
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const categoryMatch =
        !filters.category || room.category === filters.category;
      const priceMatch = room.price <= filters.maxPrice;
      return categoryMatch && priceMatch;
    });
  }, [rooms, filters]);

  const handleFilterChange = (category: string | null, maxPrice: number) => {
    setFilters({ category, maxPrice });
  };

  const handleClearSearch = () => {
    setActiveCheckIn("");
    setActiveCheckOut("");
    setRooms([]);
    setFilters({ category: null, maxPrice: 1000 });
    // Reset search context as well
    setSearchData({ checkIn: "", checkOut: "", guests: "2 Adults" });
    router.push("/rooms");
  };

  return {
    rooms,
    filteredRooms,
    loading,
    error,
    activeCheckIn,
    activeCheckOut,
    filters,
    selectedRoom,
    setSelectedRoom,
    formatDate,
    handleFilterChange,
    handleClearSearch,
  };
}
