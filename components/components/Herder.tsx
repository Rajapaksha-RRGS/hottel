import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import UserProfile from "./UseProfile";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Check if user is a guest (Google login or User role)
  const isGuest =
    status === "authenticated" &&
    (!session?.user?.role ||
      session?.user?.role === "Guest" ||
      session?.user?.role === "User");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Rooms", to: "/Rooms" },
    { name: "Tour", to: "/tour" },
    { name: "Spa", to: "/spa" },
    { name: "Experiences", to: "/experiences" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl md:text-3xl text-gold tracking-wider">
            VTAMIN SEE
          </span>
          <span className="hidden md:block text-bone/60 text-sm tracking-[0.3em] uppercase">
            Hotel &amp; Hostel
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.to}
              className="text-bone/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase"
            >
              {link.name}
            </Link>
          ))}

          {/* Dashboard link for logged-in guests */}
          {isGuest && (
            <Link
              href="/guest/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-gold/15 border border-gold/30 text-gold text-sm tracking-wide uppercase rounded-lg hover:bg-gold/25 transition-all duration-300"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}

          <UserProfile />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-bone p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        className="lg:hidden overflow-hidden glass"
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-bone/80 hover:text-gold transition-colors duration-300 text-sm tracking-wide uppercase py-2"
            >
              {link.name}
            </a>
          ))}

          {/* Mobile dashboard link */}
          {isGuest && (
            <Link
              href="/guest/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-gold text-sm tracking-wide uppercase py-2"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}

          <a
            href="#booking"
            className="mt-2 px-6 py-3 bg-gold text-charcoal font-medium text-sm tracking-wide uppercase text-center"
          >
            Book Now
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};
export default Navigation;
