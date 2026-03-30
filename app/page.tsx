"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Menu,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Leaf,
  Truck,
  ShieldCheck,
  Sprout,
  MessageCircle,
  Globe,
  Heart,
} from "lucide-react";

// ─── Navigation ────────────────────────────────────────────────────────────────
const AgriNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#hero" },
    { label: "Products", href: "#categories" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <Sprout
            size={28}
            className={isScrolled ? "text-green-600" : "text-white"}
          />
          <span
            className={`font-bold text-xl tracking-tight ${
              isScrolled ? "text-green-700" : "text-white"
            }`}
          >
            FreshDirect
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#categories"
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors"
          >
            Shop Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 ${isScrolled ? "text-gray-700" : "text-white"}`}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md"
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-green-600 text-sm font-medium py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#categories"
            className="mt-1 px-5 py-3 bg-green-600 text-white text-sm font-semibold rounded-full text-center hover:bg-green-700 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// ─── Hero Section ───────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 140]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/50 text-green-300 text-xs md:text-sm font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
        >
          <Leaf size={14} /> 100% Organic · Farm to Table
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          Fresh Vegetables & Fruits
          <br />
          <span className="text-green-400">Direct from Farmers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/70 text-base md:text-xl max-w-2xl mb-10"
        >
          Skip the middlemen. Get farm-fresh produce harvested this morning,
          delivered straight to your door by local farmers you can trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#categories"
            className="px-8 py-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 flex items-center gap-2 group"
          >
            Shop Fresh Produce
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
          >
            How It Works
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-white"
        >
          {[
            { value: "500+", label: "Partner Farmers" },
            { value: "10K+", label: "Happy Customers" },
            { value: "Same Day", label: "Delivery" },
            { value: "100%", label: "Organic Certified" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-400">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-white/60 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-green-400 rounded-full" />
        </motion.div>
        <span className="text-white/40 text-xs tracking-widest uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  );
};

// ─── Benefits Section ───────────────────────────────────────────────────────────
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Leaf,
      title: "100% Organic",
      desc: "All produce is grown without harmful pesticides or chemicals, certified organic by trusted agencies.",
    },
    {
      icon: Truck,
      title: "Same-Day Delivery",
      desc: "Harvested in the morning, at your doorstep by evening. Freshness you can taste.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      desc: "Every batch is inspected for quality. Not satisfied? We'll replace or refund — no questions asked.",
    },
    {
      icon: Sprout,
      title: "Support Local Farmers",
      desc: "Your purchase directly supports over 500 small-scale farming families across the region.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-green-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Farm Fresh, Every Time
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            We believe everyone deserves access to fresh, nutritious food
            straight from the source.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 text-center group"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500 transition-colors">
                <b.icon
                  size={26}
                  className="text-green-600 group-hover:text-white transition-colors"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Product Categories ─────────────────────────────────────────────────────────
const CategoriesSection = () => {
  const categories = [
    {
      name: "Leafy Greens",
      items: "Spinach, Kale, Lettuce & more",
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
    },
    {
      name: "Root Vegetables",
      items: "Carrots, Beetroot, Radish & more",
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Seasonal",
    },
    {
      name: "Tropical Fruits",
      items: "Mango, Papaya, Pineapple & more",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Popular",
    },
    {
      name: "Citrus & Berries",
      items: "Oranges, Lemon, Strawberry & more",
      image:
        "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "New",
    },
    {
      name: "Gourds & Squash",
      items: "Pumpkin, Zucchini, Bitter gourd & more",
      image:
        "https://images.unsplash.com/photo-1506917728037-b6af01a7d403?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: null,
    },
    {
      name: "Herbs & Spices",
      items: "Coriander, Mint, Ginger & more",
      image:
        "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Organic",
    },
  ];

  return (
    <section id="categories" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">
            Our Produce
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Explore our wide range of fresh, farm-picked produce. New arrivals
            every morning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-green-600 border-b-2 border-green-300 pb-1 hover:border-green-600 transition-colors font-medium group"
          >
            View All Products
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  cat: {
    name: string;
    items: string;
    image: string;
    badge: string | null;
  };
  index: number;
}

const CategoryCard = ({ cat, index }: CategoryCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ scale: 1.03 }}
      className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-md h-64"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${cat.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      {cat.badge && (
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {cat.badge}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-xl mb-1">{cat.name}</h3>
        <p className="text-white/70 text-sm">{cat.items}</p>
        <div className="mt-3 flex items-center gap-1 text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Shop Now <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── How It Works ───────────────────────────────────────────────────────────────
const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Farmers Harvest at Dawn",
      desc: "Our partner farmers harvest fresh produce every morning at first light to ensure maximum freshness.",
      color: "bg-green-100 text-green-700",
    },
    {
      step: "02",
      title: "Quality Inspection",
      desc: "Every batch is hand-inspected and graded before it leaves the farm, ensuring only the best reaches you.",
      color: "bg-orange-100 text-orange-700",
    },
    {
      step: "03",
      title: "You Place an Order",
      desc: "Browse our seasonal catalog online or via WhatsApp and place your order in minutes.",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      step: "04",
      title: "Same-Day Delivery",
      desc: "Packed in eco-friendly boxes and delivered to your doorstep by our refrigerated fleet the same day.",
      color: "bg-teal-100 text-teal-700",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">
            Our Process
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Farm to Your Table
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            From sunrise harvest to evening delivery — we make fresh produce
            effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-green-200 z-0 -translate-x-4" />
              )}
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <span
                  className={`inline-block text-2xl font-black px-3 py-1 rounded-lg mb-5 ${s.color}`}
                >
                  {s.step}
                </span>
                <h3 className="text-gray-900 font-bold text-lg mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ───────────────────────────────────────────────────────────────
const TestimonialsSection = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Home Cook, Colombo",
      avatar: "PS",
      rating: 5,
      text: "The spinach I received was incredibly fresh — it was still slightly cool from the morning harvest! I'll never go back to supermarket vegetables again.",
    },
    {
      name: "Rajan Perera",
      role: "Restaurant Owner",
      avatar: "RP",
      rating: 5,
      text: "FreshDirect has transformed our kitchen. Our chefs love the quality, and our customers can taste the difference. Consistent quality, every single day.",
    },
    {
      name: "Amali Fernando",
      role: "Nutritionist",
      avatar: "AF",
      rating: 5,
      text: "I recommend FreshDirect to all my clients. The organic certification is genuine, and the variety is excellent. The WhatsApp ordering makes it super convenient!",
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">
            Customer Love
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-green-50 rounded-2xl p-8 border border-green-100"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {r.avatar}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {r.name}
                  </p>
                  <p className="text-gray-400 text-xs">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Newsletter / CTA Section ───────────────────────────────────────────────────
const CTASection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 px-6 bg-green-700">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Leaf size={40} className="text-green-300 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Weekly Fresh Deals
          </h2>
          <p className="text-green-200 mb-8 text-lg">
            Subscribe and receive exclusive offers, seasonal picks, and recipes
            delivered straight to your inbox.
          </p>

          {submitted ? (
            <div className="bg-green-600 border border-green-400 text-green-100 px-6 py-4 rounded-xl inline-block">
              🎉 You're subscribed! Check your inbox for a welcome discount.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-green-300 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-7 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Footer ─────────────────────────────────────────────────────────────────────
const AgriFooter = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sprout size={26} className="text-green-400" />
              <span className="font-bold text-xl text-green-400">
                FreshDirect
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Connecting local farmers with conscious consumers. Fresh,
              organic, and always direct from the farm.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-400 transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Our Farmers",
                "Seasonal Products",
                "Bulk Orders",
                "Blog & Recipes",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-green-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">
                  123 Farmers Market Road, Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-green-400 flex-shrink-0" />
                <a
                  href="tel:+94771234567"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  +94 (77) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-green-400 flex-shrink-0" />
                <a
                  href="mailto:hello@freshdirect.lk"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  hello@freshdirect.lk
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Zones */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-sm">
              Delivery Zones
            </h4>
            <ul className="space-y-3">
              {[
                "Colombo & suburbs",
                "Kandy region",
                "Galle & south coast",
                "Negombo & north",
                "Kurunegala",
              ].map((zone) => (
                <li
                  key={zone}
                  className="flex items-center gap-2 text-gray-400 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {zone}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FreshDirect. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-green-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-green-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── WhatsApp Sticky Button ──────────────────────────────────────────────────────
const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/94771234567?text=Hi%2C%20I%27d%20like%20to%20order%20fresh%20produce!"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 2, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} className="text-white" fill="currentColor" />
  </motion.a>
);

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="relative">
      <AgriNav />
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <AgriFooter />
      <WhatsAppButton />
    </main>
  );
}
