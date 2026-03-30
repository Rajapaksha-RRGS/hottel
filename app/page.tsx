"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Truck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Users,
  Sprout,
  ShoppingBasket,
  Heart,
  MessageCircle,
} from "lucide-react";

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* Background with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/80 via-forest/60 to-forest-dark/70" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-mint/20 border border-mint/40 text-mint px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Leaf size={14} />
            <span>Farm-to-Table · Sri Lanka</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            Fresh Vegetables &amp; Fruits{" "}
            <span className="text-harvest">Direct from Farmers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mb-4"
          >
            Harvested today. At your door within 24 hours. No middlemen, no
            chemicals — just pure goodness straight from the soil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-4 items-center mb-10"
          >
            {["✓ Harvested Today", "✓ 24-Hour Delivery", "✓ Zero Chemicals"].map(
              (tag) => (
                <span key={tag} className="text-mint text-sm font-medium">
                  {tag}
                </span>
              )
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#marketplace"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-harvest text-forest-dark font-semibold text-base rounded-xl hover:bg-harvest-dark transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Order Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-medium text-base rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              How It Works
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── Villain Section ───────────────────────────────────────────────────────────
const VillainSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const supermarketProblems = [
    "Pesticide-laden produce",
    "Picked days (even weeks) ago",
    "Stored in cold rooms for months",
    "Multiple middlemen inflate prices",
    "Unknown source & farming practices",
  ];

  const ourBenefits = [
    "Zero synthetic chemicals, ever",
    "Harvested the very same morning",
    "Direct from the farmer to you",
    "Fair prices for farmers & buyers",
    "Know exactly which farm it came from",
  ];

  return (
    <section className="py-20 md:py-28 bg-ivory px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-forest font-medium tracking-widest uppercase text-sm mb-3">
            The Problem With Supermarkets
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-dark leading-tight">
            Your Family Deserves Better Than
            <br className="hidden md:block" /> Stale &amp; Sprayed Produce
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Supermarket column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-red-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏪</span>
              <h3 className="font-serif text-xl text-gray-800 font-semibold">
                Typical Supermarket
              </h3>
            </div>
            <ul className="space-y-3">
              {supermarketProblems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-gray-600">
                  <XCircle
                    size={18}
                    className="text-red-400 mt-0.5 flex-shrink-0"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our solution column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-mint rounded-2xl p-8 shadow-sm border border-forest/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🌿</span>
              <h3 className="font-serif text-xl text-forest-dark font-semibold">
                Fresh from Farmers
              </h3>
            </div>
            <ul className="space-y-3">
              {ourBenefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-forest-dark"
                >
                  <CheckCircle
                    size={18}
                    className="text-forest mt-0.5 flex-shrink-0"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Trust Bar ─────────────────────────────────────────────────────────────────
const TrustBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    {
      icon: Sprout,
      value: "500+",
      label: "Partner Farmers",
      color: "text-harvest",
    },
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Families",
      color: "text-harvest",
    },
    {
      icon: Truck,
      value: "24 hrs",
      label: "Delivery Guarantee",
      color: "text-harvest",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Chemical-Free",
      color: "text-harvest",
    },
  ];

  return (
    <section className="py-16 bg-forest px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <stat.icon size={26} className={stat.color} />
              </div>
              <span className="font-serif text-4xl md:text-5xl text-white font-bold">
                {stat.value}
              </span>
              <span className="text-mint/80 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── How It Works (3-Step Plan) ────────────────────────────────────────────────
const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      step: "01",
      icon: ShoppingBasket,
      title: "Browse & Pick",
      desc: "Explore our seasonal marketplace. Choose fresh produce harvested by name-known farmers in Sri Lanka.",
    },
    {
      step: "02",
      icon: Sprout,
      title: "We Harvest",
      desc: "Your order triggers a harvest. Farmers pick only what you need — no waste, no pre-storage.",
    },
    {
      step: "03",
      icon: Truck,
      title: "Delivered Fresh",
      desc: "Packed with care and delivered to your door within 24 hours of harvest — still crisp, still alive.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-forest font-medium tracking-widest uppercase text-sm mb-3">
            Simple As 1-2-3
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-dark">
            From Farm to Your Table
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-mint-dark" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-28 h-28 rounded-full bg-mint flex flex-col items-center justify-center mb-6 shadow-md">
                <span className="text-forest text-xs font-bold tracking-widest uppercase mb-1">
                  Step {s.step}
                </span>
                <s.icon size={30} className="text-forest" />
              </div>
              <h3 className="font-serif text-xl text-forest-dark font-semibold mb-3">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Produce Card ──────────────────────────────────────────────────────────────
interface ProduceCardProps {
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  emoji: string;
  tag: string;
}

const ProduceCard = ({
  name,
  farmer,
  location,
  price,
  unit,
  emoji,
  tag,
}: ProduceCardProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-shadow duration-300"
    >
      {/* Produce visual */}
      <div className="bg-mint/40 h-40 flex items-center justify-center relative">
        <span className="text-7xl select-none">{emoji}</span>
        <span className="absolute top-3 right-3 bg-harvest text-forest-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {tag}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-serif text-lg text-forest-dark font-semibold mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <Leaf size={11} className="text-forest" />
          <span>
            {farmer} · {location}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-forest font-bold text-lg">
            Rs.{price}
            <span className="text-gray-400 font-normal text-sm"> / {unit}</span>
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-harvest text-forest-dark text-sm font-semibold rounded-xl hover:bg-harvest-dark transition-colors duration-200"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Featured Marketplace ──────────────────────────────────────────────────────
const MarketplaceSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const produce: ProduceCardProps[] = [
    {
      name: "Organic Tomatoes",
      farmer: "Kumara Perera",
      location: "Nuwara Eliya",
      price: "180",
      unit: "500g",
      emoji: "🍅",
      tag: "Seasonal",
    },
    {
      name: "Baby Spinach",
      farmer: "Niluka Silva",
      location: "Badulla",
      price: "90",
      unit: "250g",
      emoji: "🥬",
      tag: "Popular",
    },
    {
      name: "Sweet Carrots",
      farmer: "Arjuna Bandara",
      location: "Kandy",
      price: "120",
      unit: "1 kg",
      emoji: "🥕",
      tag: "Fresh",
    },
    {
      name: "Dragon Fruit",
      farmer: "Suneetha Jayawardena",
      location: "Kurunegala",
      price: "350",
      unit: "piece",
      emoji: "🐉",
      tag: "Exotic",
    },
    {
      name: "Mango (Karthakolomban)",
      farmer: "Priya Fernando",
      location: "Jaffna",
      price: "240",
      unit: "kg",
      emoji: "🥭",
      tag: "Seasonal",
    },
    {
      name: "Green Beans",
      farmer: "Saman Dissanayake",
      location: "Matale",
      price: "100",
      unit: "500g",
      emoji: "🫘",
      tag: "Popular",
    },
  ];

  return (
    <section id="marketplace" className="py-20 md:py-28 bg-ivory px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-forest font-medium tracking-widest uppercase text-sm mb-3">
            Today&apos;s Harvest
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-dark mb-4">
            Seasonal Produce Marketplace
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every product is tied to a real farmer. Tap a card to learn their
            story and see how your food is grown.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produce.map((item) => (
            <ProduceCard key={item.name} {...item} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-forest text-forest font-semibold rounded-xl hover:bg-forest hover:text-white transition-all duration-300 group"
          >
            View Full Marketplace
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Success Vision Section ────────────────────────────────────────────────────
const SuccessVisionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 bg-white px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="h-80 md:h-[480px] rounded-3xl bg-cover bg-center shadow-xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-forest text-white rounded-2xl px-6 py-4 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-harvest" />
                <span className="font-semibold text-sm">Healthier Families</span>
              </div>
              <p className="text-mint/80 text-xs mt-1">
                Sri Lanka&apos;s #1 Farm-to-Table
              </p>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-forest font-medium tracking-widest uppercase text-sm mb-4">
              Imagine This
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-forest-dark leading-tight mb-6">
              A Table Full of Real,{" "}
              <span className="text-forest">Nourishing Food</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Picture your family gathering around a meal where every ingredient
              was growing in the earth just hours ago. Bright colours, real
              flavours, and the peace of mind that no harmful chemicals touched
              what your children eat.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              That&apos;s not a dream — that&apos;s what thousands of Sri Lankan
              families experience every week with Fresh from Farmers. Your Amma
              will taste the difference from the very first bite.
            </p>
            <a
              href="#marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-harvest text-forest-dark font-semibold rounded-xl hover:bg-harvest-dark transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              Start Your Fresh Journey
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ────────────────────────────────────────────────────────────────────
const AgriFooter = () => (
  <footer className="bg-forest-dark text-white/80 py-12 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf size={22} className="text-harvest" />
            <span className="font-serif text-lg text-white font-semibold">
              Fresh from Farmers
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            Connecting Sri Lankan farmers directly with health-conscious
            families. Harvested today, delivered tomorrow.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Marketplace",
              "How It Works",
              "Our Farmers",
              "About Us",
              "Contact",
            ].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="hover:text-harvest transition-colors duration-200"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 +94 77 123 4567</li>
            <li>✉️ hello@freshfromfarmers.lk</li>
            <li>📍 Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Fresh from Farmers · Sri Lanka. All rights
        reserved.
      </div>
    </div>
  </footer>
);

// ─── WhatsApp Floating Button ──────────────────────────────────────────────────
const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/94771234567?text=Hi%2C%20I%27d%20like%20to%20order%20fresh%20produce!"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} className="text-white" fill="white" />
  </motion.a>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="relative bg-white">
      <HeroSection />
      <VillainSection />
      <TrustBar />
      <HowItWorksSection />
      <MarketplaceSection />
      <SuccessVisionSection />
      <AgriFooter />
      <WhatsAppButton />
    </main>
  );
}
