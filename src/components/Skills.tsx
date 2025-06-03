import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillBadge from './SkillBadge';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Wrench, Brain, Globe } from 'lucide-react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import LazyLoadWrapper from './LazyLoadWrapper';

// Memoized skills data
const PROGRAMMING_LANGUAGES = [
  { name: 'C++', level: 'intermediate' as const, preferred: true },
  { name: 'Python', level: 'exposure' as const },
  { name: 'LaTeX', level: 'proficient' as const },
  { name: 'HTML/CSS/JS', level: 'basic' as const },
] as const;

const FRAMEWORKS = [
  { name: 'Qt 6', level: 'intermediate' as const },
  { name: 'Git', level: 'basic' as const },
  { name: 'Linux', level: 'basic' as const },
  { name: 'VS Code', level: 'intermediate' as const },
  { name: 'SQLite', level: 'basic' as const },
  { name: 'Discord Bots', level: 'basic' as const },
] as const;

const CONCEPTS = [
  { name: 'OOP', level: 'intermediate' as const },
  { name: 'DSA', level: 'intermediate' as const },
  { name: 'Algebra', level: 'proficient' as const },
  { name: 'Linear Algebra', level: 'intermediate' as const },
  { name: 'Mathematical Analysis', level: 'intermediate' as const },
  { name: 'AI/ML Concepts', level: 'exposure' as const },
] as const;

const LANGUAGES = [
  { name: 'Arabic', level: 'proficient' as const, note: 'Native' },
  { name: 'English', level: 'proficient' as const, note: 'Fluent' },
  { name: 'French', level: 'exposure' as const, note: 'Learning' },
] as const;

// Memoized animation variants with responsive optimizations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 10 },
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

const Skills: React.FC = React.memo(() => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const { isMobile, shouldReduceAnimations } = useResponsive();

  // Memoized animations
  const titleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5 }
  }), [inView]);

  const subtitleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay: 0.15 }
  }), [inView]);

  // Enhanced card data with icons
  const skillCategories = useMemo(() => [
    {
      title: "Programming Languages",
      icon: Code,
      color: "primary",
      description: "C++ is my preferred language, with a focus on efficient algorithms and Qt UI development.",
      skills: PROGRAMMING_LANGUAGES,
      delay: 0.5
    },
    {
      title: "Frameworks & Tools",
      icon: Wrench,
      color: "accent",
      description: "Essential tools and frameworks I use for development and productivity.",
      skills: FRAMEWORKS,
      delay: 0.7
    },
    {
      title: "Concepts & Knowledge Areas",
      icon: Brain,
      color: "secondary",
      description: "Core computer science and mathematical concepts that drive my problem-solving approach.",
      skills: CONCEPTS,
      delay: 0.9
    },
    {
      title: "Languages (Human)",
      icon: Globe,
      color: "primary",
      description: "Multilingual communication abilities for global collaboration.",
      skills: LANGUAGES,
      delay: 1.1
    }
  ], []);

  return (
    <section id="skills" className="bg-gradient-to-b from-card to-background relative overflow-hidden">
      {/* Enhanced background elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full filter blur-2xl"
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -25, 35, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full filter blur-2xl"
          animate={{ 
            x: [0, -25, 30, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.9, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </motion.div>

      <div className="section-container relative z-10" ref={ref}>
        <motion.h2 
          className="section-title"
          {...titleAnimation}
          style={{ willChange: 'transform, opacity' }}
        >
          My Skills
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          {...subtitleAnimation}
          style={{ willChange: 'transform, opacity' }}
        >
          A comprehensive overview of my technical skills, tools, and knowledge areas.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div key={categoryIndex} variants={cardVariants}>
                <Card className="border border-border/50 bg-card/90 backdrop-blur-sm group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden">
                  {/* Card glow effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${category.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    initial={false}
                  />
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-3">
                      <motion.div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg bg-${category.color}/20`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className={`w-4 h-4 text-${category.color}`} />
                      </motion.div>
                      <span>{category.title}</span>
                      <motion.span
                        className={`w-2 h-2 bg-${category.color} rounded-full ml-auto`}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: categoryIndex * 0.5 }}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                          transition={{ 
                            delay: category.delay + index * 0.1, 
                            duration: 0.4,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: categoryIndex % 2 === 0 ? 3 : -3,
                            y: -2
                          }}
                          style={{ willChange: 'transform' }}
                        >
                          <SkillBadge 
                            name={skill.name}
                            level={skill.level}
                            type={categoryIndex === 0 ? "language" : categoryIndex === 1 ? "framework" : categoryIndex === 2 ? "concept" : "human"}
                            className={skill.preferred ? 'border border-accent/50 shadow-lg' : ''}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {category.description && (
                      <motion.p 
                        className="text-sm text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: category.delay + category.skills.length * 0.1, duration: 0.6 }}
                      >
                        {category.description}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Skills summary section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium">Always learning and growing</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;
