
import React, { useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FolderOpen, Github, Sparkles } from 'lucide-react';
import ProjectCard from './ProjectCard';
import LazyLoadWrapper from './LazyLoadWrapper';
import { useResponsive } from '@/contexts/ResponsiveContext';

// Memoized projects data
const PROJECTS_DATA = [
  {
    title: "IYS Searcher",
    description: "A fast and efficient file search application built with C++ and Qt 6. Features a clean, custom UI with high performance search capabilities.",
    technologies: ["C++", "Qt 6", "UI/UX", "File Management"],
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3",
    githubLink: "https://github.com/ilyyeees/iys-searcher",
    demoLink: undefined,
    featured: false
  },
  {
    title: "Library Management System",
    description: "A comprehensive library management application with user authentication, book borrowing/returning functionality, and a SQLite backend. Features a modern UI with rounded corners, shadows, and custom animations.",
    technologies: ["C++", "Qt", "SQLite", "UI/UX"],
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3",
    githubLink: "https://github.com/ilyyeees/library-management",
    demoLink: undefined,
    featured: false
  },
  {
    title: "IYS Core Bot (Discord)",
    description: "A multipurpose Discord bot for announcements, moderation, and community management with plans for future AI integration.",
    technologies: ["Python", "Discord API", "Bot Development"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3",
    githubLink: "https://github.com/ilyyeees/iys-core-bot",
    demoLink: undefined,
    featured: false
  }
] as const;

// Memoized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const headerVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    rotateX: -10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
      transition: {
        type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const Projects: React.FC = React.memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { isMobile, shouldReduceAnimations } = useResponsive();

  // Memoized background animations for better performance
  const backgroundShapes = useMemo(() => [
    {
      className: "absolute top-1/4 left-1/6 w-56 h-56 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl",
      animate: shouldReduceAnimations ? {} : {
        x: [0, 100, -50, 0],
        y: [0, -50, 100, 0],
        scale: [1, 1.2, 0.8, 1],
        rotate: [0, 90, 180, 360]
      },
      transition: {
        duration: isMobile ? 30 : 20,
        repeat: shouldReduceAnimations ? 0 : Infinity,
        ease: "easeInOut"
      }
    },
    {
      className: "absolute bottom-1/4 right-1/6 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full filter blur-3xl",
      animate: shouldReduceAnimations ? {} : {
        x: [0, -80, 60, 0],
        y: [0, 60, -80, 0],
        scale: [1, 0.8, 1.3, 1],
        rotate: [360, 270, 180, 0]
      },
      transition: {
        duration: isMobile ? 35 : 25,
        repeat: shouldReduceAnimations ? 0 : Infinity,
        ease: "easeInOut"
      }
    },
    {
      className: "absolute top-3/4 left-1/2 w-40 h-40 bg-gradient-to-r from-amber-500/8 to-orange-500/8 rounded-full filter blur-2xl",
      animate: shouldReduceAnimations ? {} : {
        x: [0, 60, -40, 0],
        y: [0, -30, 60, 0],
        scale: [1, 1.1, 0.9, 1],
        rotate: [0, 180, 360]
      },
      transition: {
        duration: isMobile ? 25 : 18,
        repeat: shouldReduceAnimations ? 0 : Infinity,
        ease: "easeInOut"
      }
    }
  ], [isMobile, shouldReduceAnimations]);

  return (
    <motion.section 
      ref={ref}
      id="projects" 
      className="bg-background relative py-20 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ willChange: 'opacity' }}
    >
      {/* Enhanced animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {/* Enhanced grid pattern with glow */}
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-20"
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px", "0px 0px"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,107,53,0.15) 1px, transparent 0)`
          }}
        />
        
        {/* Floating particles */}
        <motion.div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/40 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Enhanced floating shapes */}
        {backgroundShapes.map((shape, index) => (
          <motion.div
            key={index}
            className={shape.className}
            animate={shape.animate}
            transition={shape.transition}
          />
        ))}
      </motion.div>

      <div className="section-container relative z-10">
        {/* Enhanced Header */}
        <motion.div
          variants={headerVariants}
          className="text-center mb-16"
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.div 
            className="flex items-center justify-center mb-4"
            variants={headerVariants}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <FolderOpen className="w-8 h-8 text-accent mr-3" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="section-title"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 20px rgba(255, 107, 53, 0.3)"
            }}
            transition={{ duration: 0.2 }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p 
            className="section-subtitle mt-4 max-w-2xl mx-auto"
            variants={headerVariants}
          >
            A showcase of my technical expertise and creative problem-solving through real-world applications.
          </motion.p>
          
          {/* Projects count indicator */}
          <motion.div
            className="flex justify-center items-center mt-8"
            variants={headerVariants}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Github className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                {PROJECTS_DATA.length} Projects
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {PROJECTS_DATA.map((project, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 80,
                  rotateX: -25,
                  scale: 0.85
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: index * 0.1
                  }
                }
              }}
              whileHover={{
                y: -12,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }
              }}
              className="relative"
              style={{ willChange: 'transform' }}
            >
              <LazyLoadWrapper>
                <ProjectCard
                  index={index}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  image={project.image}
                  githubLink={project.githubLink}
                  demoLink={project.demoLink}
                  featured={project.featured}
                />
              </LazyLoadWrapper>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced call to action */}
        <motion.div
          className="text-center mt-20"
          variants={headerVariants}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-purple-600/50 rounded-lg blur opacity-20"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.a
              href="https://github.com/ilyyeees"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center space-x-3 px-8 py-4 bg-card/50 backdrop-blur-sm border border-accent/30 rounded-lg hover:bg-accent/10 transition-all duration-300 group"
              whileHover={{
                borderColor: "rgba(255, 107, 53, 0.6)",
                boxShadow: "0 0 25px rgba(255, 107, 53, 0.3)"
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Github className="w-5 h-5 text-accent" />
              </motion.div>
              
              <span className="text-accent group-hover:text-primary transition-colors font-medium">
                Explore More Projects
              </span>
              
              <motion.span
                className="text-accent"
                animate={{ x: [0, 6, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            variants={headerVariants}
          >
            Check out my GitHub for more projects and contributions
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
