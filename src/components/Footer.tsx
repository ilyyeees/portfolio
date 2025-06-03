
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram, Github, Linkedin, ArrowUp, Heart, Code2, Coffee, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const Footer: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/ilyyeees",
      label: "GitHub",
      color: "hover:text-purple-400",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/ilyes-abbas-077660320/",
      label: "LinkedIn", 
      color: "hover:text-blue-400",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/il.y.s/",
      label: "Instagram",
      color: "hover:text-pink-400",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="bg-card/90 backdrop-blur-sm border-t border-border/50 relative overflow-hidden"
    >
      {/* Enhanced animated background elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-accent/8 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-accent/40' : i % 3 === 1 ? 'bg-purple-400/30' : 'bg-blue-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -60, -30],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Gradient waves */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-accent/5 via-purple-500/5 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      <div className="container mx-auto py-12 px-4 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          variants={containerVariants}
        >
          {/* Enhanced Logo and description */}
          <motion.div 
            className="mb-8 md:mb-0 text-center md:text-left"
            variants={itemVariants}
          >
            <motion.a 
              href="#home" 
              className="text-gradient font-bold text-3xl inline-flex items-center space-x-2"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 25px rgba(255, 107, 53, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>il.y.s</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className="w-6 h-6 text-accent" />
              </motion.div>
            </motion.a>
            <motion.p 
              className="text-muted-foreground text-sm mt-3 max-w-xs"
              variants={itemVariants}
            >
              AI & Data Science Student | C++ Developer
            </motion.p>
            <motion.p 
              className="text-muted-foreground/80 text-xs mt-2 flex items-center justify-center md:justify-start space-x-2"
              variants={itemVariants}
            >
              <span>Building the future, one line of code at a time</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-3 h-3 text-accent" />
              </motion.div>
            </motion.p>
          </motion.div>
          
          {/* Enhanced Social links */}
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.div
                key={social.label}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${social.gradient} rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-500`}
                />
                
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative text-muted-foreground ${social.color} transition-all duration-300 group`}
                  whileHover={{ 
                    scale: 1.2,
                    y: -3
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
            
            {/* Enhanced Scroll to top button */}
            <motion.div
              className="relative group ml-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-orange-500/50 rounded-lg blur opacity-0 group-hover:opacity-40 transition-all duration-500"
              />
              
              <motion.button
                onClick={scrollToTop}
                className="relative text-muted-foreground hover:text-accent transition-all duration-300 group"
                whileHover={{ 
                  scale: 1.2,
                  y: -3
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 backdrop-blur-sm transition-all duration-300"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Divider */}
        <motion.div 
          className="mt-16 pt-8 border-t border-border/50"
          variants={itemVariants}
        >
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center text-center md:text-left"
            variants={containerVariants}
          >
            <motion.p 
              className="text-sm text-muted-foreground flex items-center justify-center md:justify-start mb-4 md:mb-0"
              variants={itemVariants}
            >
              © {new Date().getFullYear()} Ilyes Abbas. Made with{' '}
              <motion.span
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mx-2"
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.span>
              and lots of{' '}
              <motion.span
                animate={{ 
                  y: [0, -2, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mx-1"
              >
                <Coffee className="w-4 h-4 text-amber-600 inline" />
              </motion.span>
              coffee.
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-6 text-xs text-muted-foreground/60"
              variants={itemVariants}
            >
              <motion.span
                whileHover={{ 
                  color: "rgba(255, 107, 53, 1)",
                  scale: 1.1
                }}
                className="cursor-default transition-all duration-300"
              >
                React
              </motion.span>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                •
              </motion.div>
              <motion.span
                whileHover={{ 
                  color: "rgba(255, 107, 53, 1)",
                  scale: 1.1
                }}
                className="cursor-default transition-all duration-300"
              >
                TypeScript
              </motion.span>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                •
              </motion.div>
              <motion.span
                whileHover={{ 
                  color: "rgba(255, 107, 53, 1)",
                  scale: 1.1
                }}
                className="cursor-default transition-all duration-300"
              >
                Framer Motion
              </motion.span>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                •
              </motion.div>
              <motion.span
                whileHover={{ 
                  color: "rgba(255, 107, 53, 1)",
                  scale: 1.1
                }}
                className="cursor-default transition-all duration-300"
              >
                Tailwind CSS
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
