import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/ProfileAvatar";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [location] = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 px-6 py-4 transition-all duration-500 ${
        scrolled
          ? "glassmorphism backdrop-blur-20"
          : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
              <MessageCircle className="text-white text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">ChatLink</h1>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        {location === "/" && (
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-foreground hover:text-electric-blue transition-colors duration-300"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-electric-blue transition-colors duration-300"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-electric-blue transition-colors duration-300"
            >
              Contact
            </button>
            <Link href="/login">
              <Button variant="outline" className="mr-2">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-electric-blue to-neon-green text-white border-0 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        )}

        {location !== "/" && !user && (
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            {location === "/login" ? (
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-electric-blue to-neon-green text-white border-0">
                  Sign Up
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        )}

        {user && location !== "/" && (
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {/* Profile Avatar */}
          {user && <ProfileAvatar />}
          
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-3 rounded-full glassmorphism hover:scale-110 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "light" ? (
              <Moon className="text-lg" />
            ) : (
              <Sun className="text-lg" />
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glassmorphism"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="text-lg" /> : <Menu className="text-lg" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden mt-4 p-4 rounded-2xl glassmorphism ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-4">
          {location === "/" ? (
            <>
              <button 
                onClick={() => scrollToSection("features")}
                className="text-center py-2 text-foreground hover:text-electric-blue transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("testimonials")}
                className="text-center py-2 text-foreground hover:text-electric-blue transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-center py-2 text-foreground hover:text-electric-blue transition-colors"
              >
                Contact
              </button>
              <Link href="/login">
                <Button variant="outline" className="w-full mb-2">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-electric-blue to-neon-green text-white border-0">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                <Button variant="ghost" className="w-full">Home</Button>
              </Link>
              {location === "/login" ? (
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-electric-blue to-neon-green text-white border-0">
                    Sign Up
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
