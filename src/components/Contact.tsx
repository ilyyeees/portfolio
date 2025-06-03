import React, { useMemo, useCallback, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Mail, MessageSquare, Github, Linkedin, Copy, Check, Send, Heart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import LazyLoadWrapper from './LazyLoadWrapper';

// Contact card type
interface ContactCard {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  href: string;
  username: string;
  color: string;
  isDiscord?: boolean;
}

// Memoized contact data
const CONTACT_CARDS: ContactCard[] = [
  {
    icon: Github,
    title: "GitHub",
    description: "Check out my repositories and contributions.",
    href: "https://github.com/ilyyeees",
    username: "@ilyyeees",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    description: "Connect with me professionally.",
    href: "https://www.linkedin.com/in/ilyes-abbas-077660320/",
    username: "Ilyes Abbas",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "Follow me on Instagram.",
    href: "https://www.instagram.com/il.y.s/",
    username: "@il.y.s",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Mail,
    title: "Email",
    description: "Send me an email directly.",
    href: "mailto:ilyes.abbas@ensia.edu.dz",
    username: "ilyes.abbas@ensia.edu.dz",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: MessageSquare,
    title: "Discord",
    description: "Chat with me on Discord.",
    href: "#",
    username: "il.y.s",
    color: "from-indigo-500 to-purple-500",
    isDiscord: true
  }
];

// Memoized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const itemVariants = {
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

const cardHoverVariants = {
  rest: { 
    scale: 1,
    rotateY: 0,
    rotateX: 0
  },
  hover: {
    scale: 1.02,
    rotateY: 3,
    rotateX: 2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const Contact: React.FC = React.memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  // Enhanced copy to clipboard function with feedback
  const copyToClipboard = useCallback(async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => [...prev, itemId]);
      setTimeout(() => {
        setCopiedItems(prev => prev.filter(id => id !== itemId));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Memoized animations
  const titleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5 }
  }), [isInView]);

  const subtitleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay: 0.15 }
  }), [isInView]);

  return (
    <motion.section 
      ref={ref}
      id="contact" 
      className="bg-background relative py-20 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Enhanced animated background elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Floating particles */}
        <motion.div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full"
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${25 + (i * 8)}%`
              }}
              animate={{
                y: [-30, -120, -30],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 5 + (i * 0.7),
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced background gradients */}
        <motion.div 
          className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full filter blur-3xl"
          animate={{ 
            x: [-30, 30, -30],
            y: [-15, 15, -15],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full filter blur-3xl"
          animate={{ 
            x: [30, -30, 30],
            y: [15, -15, 15],
            scale: [1.2, 1, 1.2],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional accent gradient */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-full filter blur-2xl"
          animate={{ 
            x: [-20, 20, -20],
            y: [-20, 20, -20],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="section-container relative z-10">
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Send className="w-8 h-8 text-accent mr-3" />
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
                <Heart className="w-3 h-3 text-red-400 fill-current" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="section-title"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 25px rgba(255, 107, 53, 0.4)"
            }}
            transition={{ duration: 0.2 }}
          >
            Let's Connect
          </motion.h2>
          <motion.p 
            className="section-subtitle mt-4 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Ready to collaborate on something amazing? I'm always excited to discuss new opportunities and creative projects.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {CONTACT_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="relative group"
            >
              <Card className="border border-border bg-card/50 backdrop-blur-sm h-full group relative overflow-hidden">
                {/* Enhanced gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-15 transition-all duration-500`}
                  variants={cardHoverVariants}
                />
                
                {/* Glow effect */}
                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${card.color} rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  variants={cardHoverVariants}
                />
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <motion.div
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.2 
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                      className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300"
                    >
                      <card.icon className="w-5 h-5 text-accent" />
                    </motion.div>
                    <span className="group-hover:text-accent transition-colors duration-300">{card.title}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <motion.p 
                    className="text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {card.description}
                  </motion.p>
                  
                  <motion.div className="space-y-2">
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        asChild={!card.isDiscord} 
                        className="w-full border-accent/50 hover:border-accent hover:bg-accent/20 group/button transition-all duration-300"
                        onClick={card.isDiscord ? () => copyToClipboard(card.username, card.title) : undefined}
                      >
                        {card.isDiscord ? (
                          <div className="flex items-center justify-center cursor-pointer">
                            <motion.div
                              whileHover={{ rotate: 15 }}
                              className="mr-2"
                            >
                              <card.icon className="w-4 h-4 text-accent group-hover/button:text-primary transition-colors" />
                            </motion.div>
                            <span className="group-hover/button:text-primary transition-colors">
                              {card.username}
                            </span>
                          </div>
                        ) : (
                          <a 
                            href={card.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center w-full"
                          >
                            <motion.div
                              whileHover={{ rotate: 15 }}
                              className="mr-2"
                            >
                              <card.icon className="w-4 h-4 text-accent group-hover/button:text-primary transition-colors" />
                            </motion.div>
                            <span className="group-hover/button:text-primary transition-colors">
                              Connect
                            </span>
                          </a>
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* Copy button for email and Discord */}
                    {(card.title === 'Email' || card.isDiscord) && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full border border-dashed border-accent/30 hover:border-accent/60 hover:bg-accent/10 group/copy transition-all duration-300"
                          onClick={() => copyToClipboard(card.username, card.title)}
                        >
                          <motion.div
                            className="flex items-center justify-center w-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            {copiedItems.includes(card.title) ? (
                              <>
                                <Check className="w-3 h-3 text-green-500 mr-2" />
                                <span className="text-green-500 text-xs">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-muted-foreground group-hover/copy:text-accent mr-2 transition-colors" />
                                <span className="text-muted-foreground group-hover/copy:text-accent text-xs transition-colors">Copy</span>
                              </>
                            )}
                          </motion.div>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced call to action */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-20"
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-purple-600/50 rounded-lg blur opacity-30"
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <Badge 
              variant="secondary" 
              className="relative text-lg px-8 py-3 bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/20 transition-all duration-300 cursor-default"
            >
              <motion.div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
                <motion.span
                  animate={{ 
                    opacity: [1, 0.8, 1] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Let's build something amazing together!
                </motion.span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                </motion.div>
              </motion.div>
            </Badge>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground mt-6 max-w-md mx-auto"
            variants={itemVariants}
          >
            Whether it's a collaboration, freelance project, or just a friendly chat about technology
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
});

Contact.displayName = 'Contact';

export default Contact;
