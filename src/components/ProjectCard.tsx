
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Code2 } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: readonly string[];
  image: string;
  githubLink?: string;
  demoLink?: string;
  index: number;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  image,
  githubLink,
  demoLink,
  index,
  featured = false
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      rotate: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const overlayVariants = {
    hover: {
      opacity: 0.2,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ 
        y: -15,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      className="relative group"
    >
      <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm group cursor-pointer h-full relative">
        <motion.div 
          className="aspect-video overflow-hidden relative"
          whileHover="hover"
        >
          <motion.div
            variants={imageVariants}
            className="w-full h-full"
          >
            <OptimizedImage
              src={image}
              alt={title}
              width={600}
              height={338}
              quality={85}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{
                transformOrigin: 'center center'
              }}
            />
          </motion.div>
          
          {/* Enhanced overlay effects */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"
            variants={overlayVariants}
            whileHover="hover"
          />
          
          <motion.div
            className="absolute inset-0 bg-accent/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Hover overlay with icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-primary/90 backdrop-blur-sm rounded-full p-3"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <CardHeader className="relative">
          <motion.div
            whileHover={{ x: 8 }}
            transition={{ duration: 0.2 }}
          >
            <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors duration-300">
              <span>{title}</span>
            </CardTitle>
          </motion.div>
          <CardDescription className="group-hover:text-foreground transition-colors duration-300 mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: (index * 0.2) + (i * 0.1),
                  duration: 0.4,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, -3, 3, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-secondary/60 hover:bg-accent/80 border border-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-3">
          {githubLink && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="w-full border-accent/50 hover:bg-accent/20 hover:border-accent/70 transition-all duration-300 group"
              >
                <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Github className="w-4 h-4" />
                  </motion.div>
                  <span>Code</span>
                </a>
              </Button>
            </motion.div>
          )}
          {demoLink && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button 
                size="sm" 
                asChild 
                className="w-full bg-accent hover:bg-accent/80 transition-all duration-300 group"
              >
                <a href={demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ 
                      x: [0, 2, 0],
                      y: [0, -1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.div>
                  <span>Demo</span>
                </a>
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
