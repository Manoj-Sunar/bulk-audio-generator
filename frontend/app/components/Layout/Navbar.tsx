"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

import { NAV_LINKS } from "@/app/lib/constants";
import { Heading } from "../typography/Heading";
import { cn } from "@/app/lib/helpers";
import { Button } from "../ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Animation variants - Fixed TypeScript issues
  const mobileMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // Fixed: Use a function that returns the variant object
  const linkVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut" as const // Use 'as const' for literal type
      }
    })
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50"
          : "bg-white/60 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="relative">
              <Image
                src="/wave.svg"
                alt="Bulk Voice Generator"
                width={42}
                height={42}
                priority
                className="transition-transform duration-300 hover:rotate-12"
              />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={12} className="text-primary" />
              </motion.div>
            </div>

            <Heading
              as="h1"
              size="lg"
              weight="bold"
              className="hidden sm:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Bulk Voice Generator
            </Heading>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ name, href, icon: Icon, external }) => {
            const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

            return (
              <motion.li
                key={href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    "hover:text-primary hover:bg-primary/5",
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-gray-600"
                  )}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      className={cn(
                        "transition-transform duration-300",
                        isActive && "text-primary"
                      )}
                    />
                  )}
                  {name}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Hover underline effect */}
                  <motion.span
                    className={cn(
                      "absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full",
                      isActive ? "w-6" : "w-0"
                    )}
                    whileHover={!isActive ? { width: "1.5rem" } : {}}
                    transition={{ duration: 0.3 }}
                    style={{ transform: "translateX(-50%)" }}
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="px-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">

              <Link

                href={"/bulk-audio/bulk-audio-login"}


              >
                Getstarted
              </Link>

            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setOpen((prev) => !prev)}
            className="relative rounded-full p-2.5 text-on-surface transition-all duration-300 hover:bg-primary/10 hover:text-primary md:hidden"
            aria-label="Toggle Navigation"
            aria-expanded={open}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-1 p-4 pb-6">
              {NAV_LINKS.map(({ name, href, icon: Icon, external }, index) => {
                const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

                return (
                  <motion.li
                    key={href}
                    custom={index}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                      )}
                    >
                      {Icon && (
                        <motion.div
                          whileHover={{ rotate: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon
                            size={20}
                            className={cn(
                              "transition-colors duration-300",
                              isActive && "text-primary"
                            )}
                          />
                        </motion.div>
                      )}
                      {name}

                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="ml-auto h-2 w-2 rounded-full bg-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}

              {/* Mobile CTA */}
              <motion.li
                variants={linkVariants}
                custom={NAV_LINKS.length}
                initial="hidden"
                animate="visible"
                whileHover={{ x: 8 }}
              >
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                >
                  Get Started
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}