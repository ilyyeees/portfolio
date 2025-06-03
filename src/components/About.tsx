import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, User, Heart } from 'lucide-react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import LazyLoadWrapper from './LazyLoadWrapper';

// Memoized animation variants
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

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15
    }
  }
};

const cardHoverVariants = {
  hover: { 
    boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.25), 0 8px 8px -5px rgba(0, 0, 0, 0.08)",
    y: -2
  }
};

const About: React.FC = React.memo(() => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const { isMobile, shouldReduceAnimations } = useResponsive();

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

  const tabsAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay: 0.3 }
  }), [inView]);

  return (
    <section id="about" className="bg-gradient-to-b from-background to-card relative overflow-hidden">
      {/* Subtle background elements */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div 
          className="absolute top-20 right-1/4 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"
          animate={{ 
            x: [0, 20, -10, 0],
            y: [0, -15, 25, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/3 w-24 h-24 bg-accent/10 rounded-full filter blur-xl"
          animate={{ 
            x: [0, -15, 20, 0],
            y: [0, 20, -10, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      <div className="section-container relative z-10" ref={ref}>
        <motion.h2 
          className="section-title"
          {...titleAnimation}
          style={{ willChange: 'transform, opacity' }}
        >
          About Me
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          {...subtitleAnimation}
          style={{ willChange: 'transform, opacity' }}
        >
          Get to know my background, interests, and what drives me.
        </motion.p>
        
        <motion.div
          {...tabsAnimation}
          style={{ willChange: 'transform, opacity' }}
        >
          <Tabs defaultValue="education" className="w-full mt-8">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="education" className="transition-all duration-200 hover:bg-primary/20 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="personal" className="transition-all duration-200 hover:bg-accent/20 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="interests" className="transition-all duration-200 hover:bg-secondary/20 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Interests
                </TabsTrigger>
              </TabsList>
            </motion.div>
            
            <TabsContent value="education">
              <motion.div 
                className="bg-card/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border/50"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                variants={cardHoverVariants}
                whileHover="hover"
                style={{ willChange: 'transform' }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Educational Journey
                </motion.h3>
                
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="border-l-2 border-accent pl-4 py-2"
                    variants={itemVariants}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <h4 className="font-medium text-accent">2024 - Present</h4>
                    <p className="font-semibold mt-1">National School of Artificial Intelligence (ENSIA)</p>
                    <p className="text-muted-foreground">First Year Student</p>
                    <p className="mt-2">Studying AI and Data Science with a focus on algorithm development, mathematical foundations, and software engineering.</p>
                  </motion.div>
                  
                  <motion.div 
                    className="border-l-2 border-secondary pl-4 py-2"
                    variants={itemVariants}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <h4 className="font-medium text-accent">2022 - 2024</h4>
                    <p className="font-semibold mt-1">El Amrani Brothers High School, Batna</p>
                    <p className="text-muted-foreground">High School Education</p>
                    <p className="mt-2">Completed high school with strong foundations in mathematics, physics, and computer science.</p>
                    <motion.p 
                      className="mt-1 text-primary font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Achieved Bachelor's degree with an excellent score of 17.96 in Mathematics
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    className="border-l-2 border-muted pl-4 py-2"
                    variants={itemVariants}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <h4 className="font-medium text-accent">2021 - 2022</h4>
                    <p className="font-semibold mt-1">Ali Nmer High School</p>
                    <p className="text-muted-foreground">High School Education</p>
                    <p className="mt-2">Started high school education with a focus on STEM subjects.</p>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h4 className="font-medium mb-2">Key Coursework</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {[
                      "Algebra and Linear Algebra",
                      "Data Structures and Algorithms", 
                      "Object-Oriented Programming",
                      "Mathematical Analysis",
                      "Artificial Intelligence Fundamentals"
                    ].map((course, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        whileHover={{ x: 5, color: "#ff6b35" }}
                      >
                        {course}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <h4 className="font-medium mb-2">Activities</h4>
                  <motion.p
                    whileHover={{ scale: 1.02, color: "#ff6b35" }}
                  >
                    Member of GDG ENSIA (Google Developer Group)
                  </motion.p>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="personal">
              <motion.div 
                className="bg-card/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Personal Background
                </motion.h3>
                
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { title: "Nationality", content: "Algerian" },
                    { 
                      title: "Languages", 
                      content: ["Arabic (Native)", "English (Fluent)", "French (Learning)"],
                      isList: true 
                    },
                    { 
                      title: "Learning Style", 
                      content: "I'm naturally curious and conceptual in my approach to learning. I enjoy understanding the \"why\" behind concepts and prefer structured, detailed explanations that build from first principles." 
                    },
                    { 
                      title: "Personal Traits", 
                      content: "Detail-oriented, passionate learner, and conceptual thinker. I appreciate clean aesthetics and understanding the underlying logic of systems." 
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    >
                      <h4 className="font-medium text-accent">{item.title}</h4>
                      {item.isList ? (
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {(item.content as string[]).map((lang, i) => (
                            <motion.li 
                              key={i}
                              whileHover={{ x: 5, color: "#ff6b35" }}
                            >
                              {lang}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <motion.p 
                          className="mt-1"
                          whileHover={{ color: "#f0f0f0" }}
                        >
                          {item.content as string}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="interests">
              <motion.div 
                className="bg-card/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Technical Interests
                </motion.h3>
                
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    {
                      title: "Software Development",
                      content: "Passionate about C++ and Qt framework development. I enjoy building efficient, well-structured applications with clean user interfaces."
                    },
                    {
                      title: "Artificial Intelligence", 
                      content: "Fascinated by the ethical implications of AI, language models, and the intersection of AI with software engineering."
                    },
                    {
                      title: "System Design",
                      content: "Interested in Unix-like systems, efficient algorithms, and infrastructure design."
                    },
                    {
                      title: "UI/UX Design",
                      content: "Appreciate clean, dark interfaces with thoughtful user experiences. I enjoy implementing subtle animations and intuitive interactions."
                    }
                  ].map((interest, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    >
                      <h4 className="font-medium text-accent">{interest.title}</h4>
                      <motion.p 
                        className="mt-1"
                        whileHover={{ color: "#f0f0f0" }}
                      >
                        {interest.content}
                      </motion.p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
