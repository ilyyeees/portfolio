import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Github, Linkedin } from 'lucide-react';
import { motion, Variants, TargetAndTransition } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { EnhancedMotion } from './EnhancedMotion';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { ProgressiveImage, ContentTransition } from './AdvancedLoading';
import { MagneticButton, TextReveal } from './AdvancedUIEnhancements';

// Define a specific structure for our animation variants collection
interface HeroAnimationCollection {
  container: Variants;
  item: Variants;
  floating: TargetAndTransition; // Specifically for direct animation targets
  buttonInteraction: Variants;
  socialIconInteraction: Variants;
}

const Hero: React.FC = React.memo(() => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const { isMobile, shouldReduceAnimations } = useResponsive();

  // Typed animation collection with responsive optimizations
  const heroAnim = useMemo((): HeroAnimationCollection => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isMobile ? 0.1 : 0.15,
          delayChildren: isMobile ? 0.1 : 0.2
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: isMobile ? 15 : 25 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: isMobile ? 150 : 100,
          damping: isMobile ? 18 : 14
        }
      }
    },
    floating: { // Reduce animations on mobile for better performance
      y: isMobile ? [-3, 3, -3] : [-6, 6, -6],
      transition: {
        duration: isMobile ? 6 : 4,
        repeat: shouldReduceAnimations ? 0 : Infinity,
        ease: "easeInOut"
      }
    },
    buttonInteraction: {
      hover: { 
        scale: isMobile ? 1.02 : 1.05,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      },
      tap: { 
        scale: 0.95
      }
    },
    socialIconInteraction: {
      hover: { 
        scale: isMobile ? 1.1 : 1.2,
        y: isMobile ? -2 : -4,
        rotate: shouldReduceAnimations ? [0] : [0, 15, -15, 15, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      },
      tap: {
        scale: 0.9
      }
    }
  }), [isMobile, shouldReduceAnimations]);

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-12 md:pt-20 relative overflow-hidden bg-gradient-to-br from-background to-background/90">
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute top-1/4 -left-32 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl opacity-70"
          animate={heroAnim.floating} // Use the floating TargetAndTransition directly
          transition={{ delay: 0.1 }} // Component-level transition applies to this animation
          style={{ willChange: 'transform' }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl opacity-70"
          animate={heroAnim.floating} 
          transition={{ delay: 0.5 }}
          style={{ willChange: 'transform' }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/8 rounded-full filter blur-2xl opacity-60"
          animate={heroAnim.floating} 
          transition={{ delay: 0.9 }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div 
          className="max-w-3xl"
          variants={heroAnim.container} // Use the 'container' Variants object
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p 
            className="text-accent font-medium mb-2"
            variants={heroAnim.item} // Use the 'item' Variants object
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            variants={heroAnim.item}
          >
            <motion.span
              className="inline-block"
              whileHover={{ 
                scale: 1.02,
                rotate: [-1, 1, -1, 0],
                color: "hsl(var(--primary))",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{ willChange: 'transform, color' }}
            >
              Ilyes Abbas
            </motion.span>
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
            variants={heroAnim.item}
            whileHover={{ scale: 1.03, letterSpacing: "0.5px" }}
            style={{ willChange: 'transform, letterSpacing' }}
          >
            AI & Data Science Student | C++ Developer
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            variants={heroAnim.item}
          >
            First-year student at the National School of Artificial Intelligence (ENSIA) in Algeria,
            passionate about building efficient tools and exploring the intersection of AI and software development.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 mb-12"
            variants={heroAnim.item} // This div itself is an 'item' in the stagger
          >
            <motion.div
              variants={heroAnim.buttonInteraction} // Use 'buttonInteraction' Variants
              whileHover="hover"
              whileTap="tap"
              style={{ willChange: 'transform' }}
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300">
                <a href="#projects">View My Work</a>
              </Button>
            </motion.div>
            <motion.div
              variants={heroAnim.buttonInteraction}
              whileHover="hover"
              whileTap="tap"
              style={{ willChange: 'transform' }}
            >
              <Button variant="outline" size="lg" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-lg hover:shadow-accent/30 transition-all duration-300">
                <a href="#contact">Get In Touch</a>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex gap-5"
            variants={heroAnim.item} // This div is also an 'item'
          >
            {[
              { href: "https://github.com/ilyyeees", icon: Github },
              { href: "https://www.linkedin.com/in/ilyes-abbas-077660320/", icon: Linkedin },
              { href: "https://www.instagram.com/il.y.s/", icon: Instagram }
            ].map((social, index) => (
              <motion.a 
                key={social.icon.displayName || index} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                variants={heroAnim.socialIconInteraction} // Use 'socialIconInteraction' Variants
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }} // Initial animation for each icon itself
                animate={{ opacity: 1, y: 0 }}   // Animate into view
                transition={{ delay: 0.9 + index * 0.1, type: "spring", stiffness: 150 }} // Staggered entrance for icons
                style={{ willChange: 'transform' }}
              >
                <social.icon className="w-7 h-7" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
