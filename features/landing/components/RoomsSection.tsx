"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

// Room Card Component
interface RoomCardProps {
  title: string;
  price: string;
  image: string;
  size: string;
  available: boolean;
  featured?: boolean;
  className?: string;
}

const RoomCard = ({
  title,
  price,
  image,
  size,
  available,
  featured,
  className,
}: RoomCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={`relative group overflow-hidden glass-light rounded-lg ${className}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
      </div>

      {/* Availability Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
        <span
          className={`w-2 h-2 rounded-full ${
            available ? "bg-green-500 availability-dot" : "bg-red-500"
          }`}
        />
        <span className="text-xs text-bone/80">
          {available ? "Available" : "Booked"}
        </span>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 bg-gold text-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wider">
          Featured
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="mb-2 flex items-center gap-1 text-gold">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-bone mb-2">
          {title}
        </h3>
        <p className="text-bone/60 text-sm mb-4">{size}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-gold text-2xl font-serif">${price}</span>
            <span className="text-bone/50 text-sm"> / night</span>
          </div>
          <a
            href="/rooms"
            className="px-4 py-2 bg-gold/20 border border-gold/50 text-gold text-sm uppercase tracking-wide hover:bg-gold hover:text-charcoal transition-all duration-300 rounded inline-block text-center"
          >
            View Details
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const defaultRooms: RoomCardProps[] = [
  {
    title: "Presidential Suite",
    price: "1,299",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    size: "250 m² • King Bed • Ocean View",
    available: true,
    featured: true,
  },
  {
    title: "Executive Suite",
    price: "1,199",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    size: "200 m² • King Bed • Ocean View",
    available: true,
    featured: true,
  },
  {
    title: "Grand Deluxe",
    price: "599",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    size: "120 m² • Queen Bed • City View",
    available: true,
    featured: false,
  },
  {
    title: "Ocean Villa",
    price: "899",
    image:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    size: "180 m² • King Bed • Private Pool",
    available: false,
    featured: false,
  },
  {
    title: "Garden Suite",
    price: "449",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    size: "95 m² • Twin Beds • Garden View",
    available: true,
    featured: false,
  },
];

// Rooms Section with Bento Grid
export default function RoomsSection() {
  const [rooms, setRooms] = useState<RoomCardProps[]>(defaultRooms);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/rooms", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const dbRooms = data.rooms || data;
        if (Array.isArray(dbRooms) && dbRooms.length > 0) {
          const mappedRooms: RoomCardProps[] = dbRooms.map(
            (room: any, index: number) => {
              const fallback = defaultRooms[index % defaultRooms.length];
              const image = room.images?.[0] || room.image || fallback.image;
              const priceVal =
                room.pricePerNight || room.price || fallback.price;
              const price =
                typeof priceVal === "number"
                  ? priceVal.toLocaleString()
                  : priceVal;
              const title =
                room.name ||
                room.type ||
                (room.roomNumber ? `Room ${room.roomNumber}` : fallback.title);
              const size = `${room.sqft || 120} m² • ${
                room.bedType || "King Bed"
              } • ${room.viewType || "Ocean View"}`;
              const available = room.status
                ? room.status === "Available"
                : true;
              const featured =
                index === 0 || index === 4 || Boolean(room.featured);

              return {
                title,
                price,
                image,
                size,
                available,
                featured,
              };
            }
          );

          // Ensure exactly 5 items for the Bento Grid layout
          const finalRooms = [...mappedRooms];
          let fallbackIndex = 0;
          while (finalRooms.length < 5) {
            finalRooms.push(defaultRooms[fallbackIndex % defaultRooms.length]);
            fallbackIndex++;
          }

          setRooms(finalRooms);
        }
      } catch (err) {
        console.error("Failed to load rooms for landing section:", err);
      }
    }

    fetchRooms();
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="rooms" className="py-24 px-6 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Accommodations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone mb-6">
            Our Rooms & Suites
          </h2>
          <p className="text-bone/60 max-w-2xl mx-auto">
            Each room is a sanctuary of comfort, designed with meticulous
            attention to detail and an unwavering commitment to luxury.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          <RoomCard
            {...rooms[0]}
            className="md:col-span-2 md:row-span-2 min-h-[400px] lg:min-h-[620px]"
          />
          <RoomCard {...rooms[1]} className="min-h-[300px]" />
          <RoomCard {...rooms[2]} className="min-h-[300px]" />
          <RoomCard {...rooms[3]} className="min-h-[300px]" />
          <RoomCard
            {...rooms[4]}
            className="md:col-span-2 min-h-[300px] lg:min-h-[400px]"
          />
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/rooms"
            className="inline-flex items-center gap-2 text-gold border-b border-gold/50 pb-1 hover:border-gold transition-colors group"
          >
            View All Accommodations
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

