// app/components/Layout/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Menu, X, Sparkles, User, LogOut, Settings, HelpCircle,
  LayoutDashboard, ChevronDown
} from 'lucide-react';

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { NAV_LINKS } from '@/app/lib/constants';
import { Heading } from '../typography/Heading';
import { cn } from '@/app/lib/helpers';
import { Button } from '../ui/Button';
import { useAuth } from '@/app/lib/auth/context';
import { useLogout } from '@/app/lib/auth/hooks';

// Animated gradient background for navbar
const NavbarGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-3xl">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { user } = useAuth();

  // Scroll effect with threshold
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href));
  };

  const dropdownItems: DropdownItem[] = [
    { icon: User, label: 'Profile', href: '/bulk-audio/profile' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/bulk-audio/dashboard' },
    { icon: Settings, label: 'Settings', href: '/bulk-audio/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/bulk-audio/support' },
    { icon: LogOut, label: 'Logout', onClick: () => logout(), className: 'text-red-600 hover:bg-red-50' },
  ];

  const mobileMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }),
  };

  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'sticky top-4 z-50 mx-auto max-w-7xl px-4 transition-all duration-300 lg:px-8',
          scrolled ? 'mt-0' : 'mt-0'
        )}
      >
        <div
          className={cn(
            'relative rounded-2xl border transition-all duration-500',
            scrolled
              ? 'border-white/20 bg-white/90 backdrop-blur-2xl shadow-2xl shadow-primary/5'
              : 'border-white/40 bg-white/70 backdrop-blur-xl shadow-lg shadow-primary/5'
          )}
        >
          <NavbarGradient />

          <nav className="relative flex h-[72px] items-center justify-between px-4 sm:px-6">
            {/* Logo - FIXED: Consistent className with shrink-0 */}


            <div className="flex shrink-0 items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex  items-center"
              >
                <Link href="/" className="group flex items-center gap-3 transition-all">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <Image
                      src="/wave.svg"
                      alt="Bulk Voice Generator"
                      width={44}
                      height={44}
                      priority
                      className="relative transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                    />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 20, -20, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <Sparkles size={14} className="text-primary drop-shadow-lg" />
                    </motion.div>
                  </div>
                  <div className="hidden sm:block">
                    <Heading as="h1" size="lg" weight="bold" className="leading-tight">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Bulk Voice
                      </span>
                      <span className="ml-1 text-on-surface">Generator</span>
                    </Heading>
                    <p className="text-[10px] font-medium text-on-surface-variant/60 tracking-wider uppercase">
                      AI Audio Studio
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
            {/* Desktop Nav Links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map(({ name, href, icon: Icon, external }) => {
                const active = isActive(href);
                return (
                  <motion.li
                    key={href}
                    onHoverStart={() => setHoveredLink(href)}
                    onHoverEnd={() => setHoveredLink(null)}
                    className="relative"
                  >
                    <Link
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                        'hover:text-primary',
                        active
                          ? 'text-primary bg-primary/10 shadow-inner shadow-primary/5'
                          : 'text-on-surface-variant/70 hover:bg-primary/5 hover:shadow-sm'
                      )}
                    >
                      {Icon && (
                        <Icon
                          size={18}
                          className={cn(
                            'transition-all duration-300',
                            active ? 'text-primary' : 'text-on-surface-variant/50 group-hover:text-primary',
                            hoveredLink === href && 'scale-110'
                          )}
                        />
                      )}
                      <span className="relative">
                        {name}
                        {active && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        )}
                      </span>
                    </Link>

                    {hoveredLink === href && (
                      <motion.div
                        layoutId="hoverGlow"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {/* Right side - Actions - FIXED: Consistent className with shrink-0 */}
            <div className="flex shrink-0 items-center gap-2">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={cn(
                      'flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 transition-all duration-300',
                      'bg-primary/5 hover:bg-primary/10 border border-primary/10',
                      dropdownOpen && 'ring-2 ring-primary/30 bg-primary/10'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="User menu"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25">
                      <span className="text-sm font-bold uppercase">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden text-sm font-medium text-on-surface sm:block">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'text-on-surface-variant transition-transform duration-300',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl shadow-primary/10 py-2 overflow-hidden"
                      >
                        <div className="border-b border-gray-100/50 px-4 py-3 mb-1">
                          <p className="font-semibold text-on-surface">{user.name || 'User'}</p>
                          <p className="text-sm text-on-surface-variant/60 truncate">{user.email}</p>
                        </div>

                        {dropdownItems.map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={() => setDropdownOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-primary/5',
                                  item.className
                                )}
                              >
                                <item.icon size={18} className="text-on-surface-variant/60" />
                                {item.label}
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  setDropdownOpen(false);
                                  item.onClick?.();
                                }}
                                className={cn(
                                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-primary/5',
                                  item.className
                                )}
                              >
                                <item.icon size={18} className="text-on-surface-variant/60" />
                                {item.label}
                              </button>
                            )}
                          </motion.div>
                        ))}

                        <div className="border-t border-gray-100/50 px-4 py-3 mt-1 flex gap-3 justify-center">
                          {[
                            { icon: FaGithub, href: 'https://github.com/Manoj-Sunar' },
                            { icon: FaTwitter, href: 'https://x.com/home' },
                            { icon: FaLinkedin, href: 'https://www.linkedin.com/feed/' },
                          ].map((social, i) => (
                            <motion.a
                              key={i}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full p-1.5 text-on-surface-variant/40 transition-all hover:bg-primary/5 hover:text-primary"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <social.icon size={16} />
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40">
                      <Link href="/bulk-audio/bulk-audio-login" className="flex items-center gap-2">
                        Get Started
                        <Sparkles size={16} />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-primary/10 lg:hidden"
                aria-label="Toggle Navigation"
                aria-expanded={open}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={open ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-on-surface"
                  >
                    {open ? <X size={22} /> : <Menu size={22} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl lg:hidden"
              >
                <ul className="space-y-1 p-4 pb-6">
                  {NAV_LINKS.map(({ name, href, icon: Icon, external }, index) => {
                    const active = isActive(href);
                    return (
                      <motion.li
                        key={href}
                        custom={index}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ x: 8, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300',
                            active
                              ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-inner'
                              : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                          )}
                        >
                          {Icon && (
                            <Icon
                              size={20}
                              className={cn(
                                'transition-all duration-300',
                                active ? 'text-primary' : 'text-on-surface-variant/50'
                              )}
                            />
                          )}
                          <span className="flex-1">{name}</span>
                          {active && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          {external && (
                            <span className="text-xs text-on-surface-variant/40">↗</span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}

                  {!user && (
                    <motion.li
                      variants={linkVariants}
                      custom={NAV_LINKS.length}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href="/bulk-audio/bulk-audio-login"
                        onClick={() => setOpen(false)}
                        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                      >
                        Get Started
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.li>
                  )}

                  {user && (
                    <motion.li
                      variants={linkVariants}
                      custom={NAV_LINKS.length + 1}
                      initial="hidden"
                      animate="visible"
                      className="mt-2 rounded-xl bg-primary/5 p-4 border border-primary/10"
                    >
                      <p className="font-medium text-on-surface">{user.name || 'User'}</p>
                      <p className="text-sm text-on-surface-variant/60">{user.email}</p>
                      <button
                        onClick={() => {
                          setOpen(false);
                          logout();
                        }}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}