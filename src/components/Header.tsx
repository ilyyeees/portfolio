import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

// Memoized navigation links
const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
] as const;

// Memoized animation variants
const headerVariants = {
  initial: { y: -100 },
  animate: { y: 0 }
};

const logoHoverVariants = {
  hover: { 
    rotate: 360,
    borderColor: "hsl(var(--primary))" // Use theme primary color
  }
};

const linkHoverVariants = {
  hover: { y: -1 }
};

const underlineVariants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 }
};

const mobileMenuVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 }
};

const Header: React.FC = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debounced scroll handler for better performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const isScrolled = window.scrollY > 20;
        setScrolled(isScrolled);
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  }, [mobileMenuOpen, closeMobileMenu]);

  // Memoized header class
  const headerClassName = useMemo(() => cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    scrolled 
      ? 'bg-background/80 backdrop-blur-lg shadow-lg border-border/50' // Increased blur, added shadow
      : 'bg-transparent border-transparent'
  ), [scrolled]);

  return (
    <motion.header 
      className={headerClassName}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: 'transform' }}
      role="banner"
      onKeyDown={handleKeyDown}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.a 
          href="#home" 
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          aria-label="Go to home section"
        >
          <motion.div 
            className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-accent shadow-lg hover:shadow-accent/30 transition-all duration-300"
            variants={logoHoverVariants}
            whileHover="hover"
            transition={{ duration: 0.4 }}
            style={{ willChange: 'transform, border-color' }} // Added border-color to willChange
          >
            <motion.div // Wrapper for image hover effect
              className="h-full w-full"
              whileHover={{ filter: "brightness(1.1)" }} // Slight brightness increase on image
              transition={{ duration: 0.2 }}
            >
              <OptimizedImage
                src="/assets/logo.jpg"
                alt="Logo"
                width={48}
                height={48}
                quality={90}
                loading="eager"
                className="h-full w-full object-contain"
                style={{
                  willChange: 'transform'
                }}
              />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-[#ea384c]/30 to-transparent"
              whileHover={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            ></motion.div>
          </motion.div>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link, index) => (
            <motion.a 
              key={link.name}
              href={link.href}
              className="relative text-foreground hover:text-primary transition-colors group overflow-hidden py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md" // Added focus styles
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.25, ease: "easeOut" }}
              variants={linkHoverVariants}
              whileHover="hover"
              style={{ willChange: 'transform, color' }}
              aria-label={`Go to ${link.name} section`}
            >
              <span className="relative z-10">{link.name}</span>
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
                variants={underlineVariants}
                initial="initial"
                whileHover="hover"
                transition={{ duration: 0.25, ease: "easeOut" }} // Added ease
              />
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden text-foreground p-2 hover:text-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.svg 
                key="close"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg 
                key="menu"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            id="mobile-menu"
            className="md:hidden bg-card/95 backdrop-blur-lg py-4 border-t border-border/50 shadow-md"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {NAV_LINKS.map((link, index) => (
                <motion.a 
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                  onClick={closeMobileMenu}
                  whileHover={{ x: 8, color: "#ff6b35" }}
                  aria-label={`Go to ${link.name} section`}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

Header.displayName = 'Header';

export default Header;
