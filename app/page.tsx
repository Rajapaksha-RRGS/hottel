"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ShoppingCart,
  Leaf,
  Truck,
  Check,
  Star,
  ArrowRight,
  Shield,
  Heart,
  Zap,
  Users,
  MessageCircle,
  AlertTriangle,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  green: "#2D6A4F",
  greenLight: "#52B788",
  mint: "#D8F3DC",
  mintDark: "#B7E4C7",
  yellow: "#FFB703",
  yellowDark: "#FB8500",
  white: "#FFFFFF",
  ivory: "#F8F9FA",
  textDark: "#1B2E21",
  textMid: "#4A5568",
  textLight: "#718096",
} as const;

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/94771234567?text=Hi%2C%20I%27d%20like%20to%20order%20fresh%20vegetables%20and%20fruits!"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-2xl"
    style={{ backgroundColor: "#25D366", color: "#fff" }}
  >
    <MessageCircle size={24} />
    <span className="hidden sm:inline text-sm font-semibold">Order on WhatsApp</span>
  </motion.a>
);

// ─── Navigation ───────────────────────────────────────────────────────────────
const Navbar = () => (
  <header
    className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
    style={{
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.mint}`,
    }}
  >
    <div className="flex items-center gap-2">
      <Leaf size={24} style={{ color: C.green }} />
      <span className="font-serif text-xl font-bold" style={{ color: C.green }}>
        FreshDirect.lk
      </span>
    </div>
    <nav
      className="hidden md:flex items-center gap-8 text-sm font-medium"
      style={{ color: C.textMid }}
    >
      <a href="#how-it-works" className="hover:text-green-700 transition-colors">
        How It Works
      </a>
      <a href="#marketplace" className="hover:text-green-700 transition-colors">
        Shop
      </a>
      <a href="#farmers" className="hover:text-green-700 transition-colors">
        Our Farmers
      </a>
    </nav>
    <a
      href="#marketplace"
      className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
      style={{ backgroundColor: C.yellow, color: C.textDark }}
    >
      <ShoppingCart size={16} />
      Order Now
    </a>
  </header>
);

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ backgroundColor: C.mint }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: C.mintDark }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: C.greenLight }}
      />

      {/* Parallax hero image */}
      <motion.div
        style={{ y }}
        className="absolute right-0 bottom-0 top-0 hidden lg:block w-1/2"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80')",
            borderRadius: "40px 0 0 40px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(216,243,220,1) 0%, rgba(216,243,220,0) 30%)",
            borderRadius: "40px 0 0 40px",
          }}
        />
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
            style={{ backgroundColor: C.green, color: "#fff" }}
          >
            <Zap size={14} />
            Harvested Today · Delivered in 24 Hours
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ color: C.textDark }}
          >
            Fresh Vegetables &amp;{" "}
            <span style={{ color: C.green }}>Fruits Direct</span> from Farmers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl mb-10 leading-relaxed"
            style={{ color: C.textMid }}
          >
            No middlemen. No chemicals. No cold-storage delays. Pure farm
            goodness for your family — straight from the fields of Sri Lanka.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#marketplace"
              className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold shadow-lg hover:brightness-105 transition-all duration-200 group"
              style={{ backgroundColor: C.yellow, color: C.textDark }}
            >
              <ShoppingCart size={20} />
              Order Now
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold border-2 transition-all duration-200 hover:bg-white"
              style={{ borderColor: C.green, color: C.green }}
            >
              How It Works
            </a>
          </motion.div>

          {/* Mini trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap gap-6 mt-10"
          >
            {[
              { icon: Shield, text: "100% Chemical-Free" },
              { icon: Truck, text: "24-Hour Delivery" },
              { icon: Leaf, text: "500+ Local Farmers" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: C.green }}
              >
                <Icon size={16} />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ─── Villain Section ──────────────────────────────────────────────────────────
const VillainSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const problems = [
    "Produce sitting in cold storage for 2–3 weeks",
    "Invisible pesticide residue on your child's plate",
    "Middlemen mark up prices by 300%",
    "No idea which farm grew your vegetables",
  ];

  const solutions = [
    "Harvested the same morning it reaches you",
    "Certified chemical-free, farmer-verified",
    "You pay the farmer directly — fair prices",
    "Every product shows the farmer's name & photo",
  ];

  return (
    <section ref={ref} className="py-20 px-6" style={{ backgroundColor: C.ivory }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.greenLight }}
          >
            The Real Story
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: C.textDark }}
          >
            Why Supermarket Produce{" "}
            <span style={{ color: "#E53E3E" }}>Isn&apos;t Good Enough</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl p-8 border-2"
            style={{ backgroundColor: "#FFF5F5", borderColor: "#FC8181" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="rounded-full p-2"
                style={{ backgroundColor: "#FED7D7" }}
              >
                <AlertTriangle size={22} style={{ color: "#E53E3E" }} />
              </div>
              <h3
                className="font-serif text-xl font-bold"
                style={{ color: "#C53030" }}
              >
                The Supermarket Problem
              </h3>
            </div>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "#742A2A" }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#FC8181", color: "#fff" }}
                  >
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl p-8 border-2"
            style={{ backgroundColor: "#F0FFF4", borderColor: C.greenLight }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="rounded-full p-2"
                style={{ backgroundColor: C.mint }}
              >
                <Leaf size={22} style={{ color: C.green }} />
              </div>
              <h3
                className="font-serif text-xl font-bold"
                style={{ color: C.green }}
              >
                The FreshDirect.lk Way
              </h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: C.textDark }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: C.green, color: "#fff" }}
                  >
                    ✓
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Trust Bar ────────────────────────────────────────────────────────────────
const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const stats = [
    { value: "500+", label: "Local Farmers", icon: Users },
    { value: "10,000+", label: "Happy Families", icon: Heart },
    { value: "24hrs", label: "Farm to Door", icon: Truck },
    { value: "100%", label: "Chemical-Free", icon: Shield },
  ];

  return (
    <section
      ref={ref}
      className="py-16 px-6"
      style={{ backgroundColor: C.green }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <Icon
                size={32}
                className="mx-auto mb-3 opacity-80"
                style={{ color: C.yellow }}
              />
              <div
                className="font-serif text-4xl font-bold mb-1"
                style={{ color: "#fff" }}
              >
                {value}
              </div>
              <div
                className="text-sm font-medium opacity-80"
                style={{ color: C.mint }}
              >
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── 3-Step Plan ─────────────────────────────────────────────────────────────
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      step: "01",
      title: "Browse & Pick",
      desc: "Explore our seasonal marketplace. Filter by farm, location, or crop type. See today's harvest availability in real time.",
      icon: Search,
      color: C.mint,
    },
    {
      step: "02",
      title: "We Harvest",
      desc: "Your order triggers an instant alert to the farmer. They harvest fresh produce specifically for your order — not from storage.",
      icon: Leaf,
      color: "#FEF9C3",
    },
    {
      step: "03",
      title: "Delivered Fresh",
      desc: "Our cold-chain riders deliver directly to your doorstep within 24 hours. You receive a notification when it's on the way.",
      icon: Truck,
      color: "#FEE2E2",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 px-6"
      style={{ backgroundColor: C.white }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.greenLight }}
          >
            Simple Process
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: C.textDark }}
          >
            Farm to Table in{" "}
            <span style={{ color: C.green }}>3 Easy Steps</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ step, title, desc, icon: Icon, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-3xl p-8 shadow-sm"
              style={{ backgroundColor: color }}
            >
              <div
                className="font-serif text-6xl font-bold opacity-15 absolute top-6 right-8 select-none"
                style={{ color: C.textDark }}
              >
                {step}
              </div>
              <div
                className="rounded-2xl w-14 h-14 flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: C.green }}
              >
                <Icon size={26} style={{ color: "#fff" }} />
              </div>
              <h3
                className="font-serif text-2xl font-bold mb-3"
                style={{ color: C.textDark }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: C.textMid }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Featured Marketplace ─────────────────────────────────────────────────────
interface ProduceCardProps {
  name: string;
  farmer: string;
  village: string;
  price: string;
  unit: string;
  tag: string;
  emoji: string;
  rating: number;
  reviews: number;
}

const ProduceCard = ({
  name,
  farmer,
  village,
  price,
  unit,
  tag,
  emoji,
  rating,
  reviews,
}: ProduceCardProps) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="rounded-3xl overflow-hidden shadow-md bg-white"
    style={{ border: `1px solid ${C.mint}` }}
  >
    {/* Image area */}
    <div
      className="relative h-44 flex items-center justify-center text-6xl"
      style={{ backgroundColor: C.mint }}
    >
      <span>{emoji}</span>
      <span
        className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold"
        style={{ backgroundColor: C.green, color: "#fff" }}
      >
        {tag}
      </span>
    </div>

    <div className="p-5">
      <h4
        className="font-serif text-lg font-bold mb-1"
        style={{ color: C.textDark }}
      >
        {name}
      </h4>

      {/* Farmer info */}
      <div className="flex items-center gap-1.5 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: C.mint, color: C.green }}
        >
          {farmer[0]}
        </div>
        <span className="text-xs" style={{ color: C.textMid }}>
          <span className="font-semibold" style={{ color: C.green }}>
            {farmer}
          </span>{" "}
          · {village}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            fill={i < Math.round(rating) ? C.yellow : "none"}
            style={{ color: C.yellow }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: C.textLight }}>
          ({reviews})
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-xl" style={{ color: C.textDark }}>
            Rs {price}
          </span>
          <span className="text-xs ml-1" style={{ color: C.textLight }}>
            /{unit}
          </span>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:brightness-105"
          style={{ backgroundColor: C.yellow, color: C.textDark }}
        >
          <ShoppingCart size={14} />
          Add
        </button>
      </div>
    </div>
  </motion.div>
);

const MarketplaceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const produce: ProduceCardProps[] = [
    {
      name: "Organic Tomatoes",
      farmer: "Saman Perera",
      village: "Dambulla",
      price: "120",
      unit: "kg",
      tag: "Today's Pick",
      emoji: "🍅",
      rating: 5,
      reviews: 142,
    },
    {
      name: "Baby Spinach",
      farmer: "Kamala Wijeratne",
      village: "Nuwara Eliya",
      price: "80",
      unit: "250g",
      tag: "Organic",
      emoji: "🥬",
      rating: 4.5,
      reviews: 98,
    },
    {
      name: "Fresh Carrots",
      farmer: "Nimal Silva",
      village: "Badulla",
      price: "65",
      unit: "kg",
      tag: "Chemical-Free",
      emoji: "🥕",
      rating: 5,
      reviews: 211,
    },
    {
      name: "Green Beans",
      farmer: "Priya Fernando",
      village: "Kandy",
      price: "90",
      unit: "500g",
      tag: "Seasonal",
      emoji: "🫘",
      rating: 4.5,
      reviews: 76,
    },
    {
      name: "Ripe Mangoes",
      farmer: "Rohan Jayawardena",
      village: "Kurunegala",
      price: "200",
      unit: "kg",
      tag: "Today's Pick",
      emoji: "🥭",
      rating: 5,
      reviews: 305,
    },
    {
      name: "Drumstick",
      farmer: "Aruna Bandara",
      village: "Anuradhapura",
      price: "70",
      unit: "bunch",
      tag: "Ayurvedic",
      emoji: "🌿",
      rating: 4,
      reviews: 54,
    },
  ];

  return (
    <section
      id="marketplace"
      ref={ref}
      className="py-20 px-6"
      style={{ backgroundColor: C.ivory }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.greenLight }}
          >
            Seasonal Harvest
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
            style={{ color: C.textDark }}
          >
            Today&apos;s{" "}
            <span style={{ color: C.green }}>Fresh Picks</span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: C.textMid }}>
            Every item is harvested this morning. Each card tells you exactly
            which farmer grew it and which village it came from.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produce.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProduceCard {...item} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold border-2 transition-all hover:text-white"
            style={{ borderColor: C.green, color: C.green }}
          >
            View All Produce
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Success Vision ───────────────────────────────────────────────────────────
const SuccessVisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-20 px-6 overflow-hidden"
      style={{ backgroundColor: C.white }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden aspect-[4/3] bg-cover bg-center shadow-xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80')",
              }}
            />
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 rounded-2xl px-5 py-4 shadow-xl"
              style={{
                backgroundColor: C.white,
                border: `2px solid ${C.mint}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Heart size={22} style={{ color: "#E53E3E" }} />
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: C.textDark }}
                  >
                    10,000+ families
                  </div>
                  <div className="text-xs" style={{ color: C.textLight }}>
                    eating healthier every day
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: C.greenLight }}
            >
              Imagine This
            </p>
            <h2
              className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ color: C.textDark }}
            >
              Your Family Deserves the{" "}
              <span style={{ color: C.green }}>Freshest, Safest Food</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: C.textMid }}
            >
              Picture your children eating vibrant, chemical-free vegetables
              that were still in the ground this morning. No preservatives. No
              wax coating. No mystery supply chains. Just pure, honest food —
              the way your grandmother used to buy it, but delivered to your
              door.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Amma knows exactly which farm grew her curry leaves",
                "Your kids ask for second helpings of salad",
                "You spend less because there's no middleman markup",
                "You support a local farming family with every order",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: C.textMid }}
                >
                  <Check
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: C.green }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#marketplace"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-base shadow-md hover:brightness-105 transition-all group"
              style={{ backgroundColor: C.yellow, color: C.textDark }}
            >
              <ShoppingCart size={18} />
              Start Your First Order
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const SiteFooter = () => (
  <footer
    className="py-12 px-6"
    style={{ backgroundColor: C.textDark, color: "#fff" }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf size={20} style={{ color: C.yellow }} />
            <span className="font-serif text-lg font-bold">FreshDirect.lk</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Connecting Sri Lankan families directly with certified local farmers.
            Harvested today, delivered tomorrow.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4" style={{ color: C.yellow }}>
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm opacity-70">
            {[
              "Shop",
              "Our Farmers",
              "How It Works",
              "About Us",
              "Contact",
            ].map((l) => (
              <li key={l}>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4" style={{ color: C.yellow }}>
            Contact Us
          </h4>
          <p className="text-sm opacity-70 mb-2">📞 +94 77 123 4567</p>
          <p className="text-sm opacity-70 mb-2">✉️ hello@freshdirect.lk</p>
          <p className="text-sm opacity-70">📍 Colombo, Sri Lanka</p>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: "#25D366", color: "#fff" }}
          >
            <MessageCircle size={14} />
            WhatsApp Us
          </a>
        </div>
      </div>

      <div
        className="pt-8 text-center text-xs opacity-50"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        © 2024 FreshDirect.lk · All rights reserved · Made with ❤️ for Sri
        Lankan families
      </div>
    </div>
  </footer>
);

// ─── Order History & Sales Chart Section ────────────────────────────────────
const monthlyOrderData = [
  { month: "Jan", orders: 820, revenue: 184000, kg: 2460 },
  { month: "Feb", orders: 940, revenue: 211500, kg: 2820 },
  { month: "Mar", orders: 1120, revenue: 252000, kg: 3360 },
  { month: "Apr", orders: 1050, revenue: 236250, kg: 3150 },
  { month: "May", orders: 1380, revenue: 310500, kg: 4140 },
  { month: "Jun", orders: 1560, revenue: 351000, kg: 4680 },
  { month: "Jul", orders: 1720, revenue: 387000, kg: 5160 },
  { month: "Aug", orders: 1640, revenue: 369000, kg: 4920 },
  { month: "Sep", orders: 1890, revenue: 425250, kg: 5670 },
  { month: "Oct", orders: 2050, revenue: 461250, kg: 6150 },
  { month: "Nov", orders: 2310, revenue: 519750, kg: 6930 },
  { month: "Dec", orders: 2680, revenue: 603000, kg: 8040 },
];

const produceShareData = [
  { name: "Vegetables", value: 48, color: C.green },
  { name: "Leafy Greens", value: 22, color: C.greenLight },
  { name: "Fruits", value: 20, color: C.yellow },
  { name: "Herbs", value: 10, color: C.mintDark },
];

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-2xl px-4 py-3 shadow-xl text-sm"
        style={{
          backgroundColor: C.textDark,
          border: `1px solid ${C.greenLight}`,
          color: "#fff",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: C.mint }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: C.yellow }}>
            {entry.name === "revenue"
              ? `Revenue: Rs ${entry.value.toLocaleString()}`
              : entry.name === "orders"
              ? `Orders: ${entry.value}`
              : `Kg Delivered: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OrderHistorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const kpis = [
    { label: "Total Orders (2024)", value: "19,160", change: "+34%", up: true },
    { label: "Revenue (LKR)", value: "4.3M+", change: "+41%", up: true },
    { label: "Kg Delivered", value: "57,480", change: "+38%", up: true },
    { label: "Avg. Order Value", value: "Rs 224", change: "+5%", up: true },
  ];

  return (
    <section
      ref={ref}
      id="order-history"
      className="py-20 px-6"
      style={{ backgroundColor: C.textDark }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: C.greenLight }}
          >
            Marketplace Performance
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-bold"
            style={{ color: "#fff" }}
          >
            Order History &amp;{" "}
            <span style={{ color: C.yellow }}>Growth Charts</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm" style={{ color: C.mintDark }}>
            Our platform has grown month-on-month since launch. Every order directly supports a local Sri Lankan farmer.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {kpis.map(({ label, value, change, up }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "rgba(45,106,79,0.18)",
                border: `1px solid ${C.green}`,
              }}
            >
              <p
                className="font-serif text-3xl font-bold mb-1"
                style={{ color: C.yellow }}
              >
                {value}
              </p>
              <p className="text-xs mb-2" style={{ color: C.mint }}>{label}</p>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} style={{ color: up ? "#4ADE80" : "#F87171" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: up ? "#4ADE80" : "#F87171" }}
                >
                  {change} YoY
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Area chart — Orders per month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 rounded-3xl p-6"
            style={{
              backgroundColor: "rgba(45,106,79,0.12)",
              border: `1px solid ${C.green}`,
            }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-1"
              style={{ color: "#fff" }}
            >
              Monthly Order Volume
            </h3>
            <p className="text-xs mb-6" style={{ color: C.greenLight }}>
              Number of orders placed per month in 2024
            </p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyOrderData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.45} />
                      <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(216,243,220,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.greenLight, fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: C.greenLight, fontSize: 11 }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke={C.yellow}
                    strokeWidth={2.5}
                    fill="url(#greenGrad)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: C.yellow,
                      stroke: C.textDark,
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie chart — Produce share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="rounded-3xl p-6"
            style={{
              backgroundColor: "rgba(45,106,79,0.12)",
              border: `1px solid ${C.green}`,
            }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-1"
              style={{ color: "#fff" }}
            >
              Produce Category Mix
            </h3>
            <p className="text-xs mb-4" style={{ color: C.greenLight }}>
              Share of orders by category
            </p>
            <div className="flex justify-center">
              <div className="h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={produceShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {produceShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {produceShareData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span style={{ color: C.mint }}>{item.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: "#fff" }}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bar chart — Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "rgba(45,106,79,0.12)",
            border: `1px solid ${C.green}`,
          }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "#fff" }}
          >
            Monthly Revenue (LKR)
          </h3>
          <p className="text-xs mb-6" style={{ color: C.greenLight }}>
            Total revenue paid directly to farmers each month
          </p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyOrderData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(216,243,220,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: C.greenLight, fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: C.greenLight, fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill={C.yellow}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="relative" style={{ backgroundColor: C.white }}>
      <Navbar />
      <HeroSection />
      <VillainSection />
      <TrustBar />
      <HowItWorksSection />
      <MarketplaceSection />
      <OrderHistorySection />
      <SuccessVisionSection />
      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
