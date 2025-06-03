import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  rotation: number;
  rotationSpeed: number;
  pulse: number;
  trail: { x: number; y: number; opacity: number }[];
  energy: number;
  attractionForce: number;
  mass: number;
  update(particles: ParticleType[]): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface FloatingParticleType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

const AnimatedBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<ParticleType[]>([]);
  const floatingParticlesRef = useRef<FloatingParticleType[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);  }, []);    // Enhanced particle configuration with more visual appeal
  const particleConfig = useMemo(() => ({
    count: reducedMotion ? 25 : 80, // Even more particles for beauty
    maxSpeed: reducedMotion ? 0.15 : 0.8,
    connectionDistance: 180,
    floatingCount: reducedMotion ? 8 : 25, // Additional floating particles
    interactionStrength: 0.02,
    trailLength: 8,
  }), [reducedMotion]);

  // Debounced resize handler
  const debouncedResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }, 100);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Optimize canvas settings
    ctx.imageSmoothingEnabled = false;

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeHandler = debouncedResize();
    window.addEventListener('resize', resizeHandler, { passive: true });    // Enhanced Particle class with more visual features
    class Particle implements ParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      rotation: number;
      rotationSpeed: number;
      pulse: number;
      trail: { x: number; y: number; opacity: number }[];
      energy: number;
      attractionForce: number;
      mass: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * particleConfig.maxSpeed;
        this.vy = (Math.random() - 0.5) * particleConfig.maxSpeed;
        this.size = Math.random() * 4 + 1.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.hue = Math.random() * 120 + 200; // Blue to purple range
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.pulse = Math.random() * Math.PI * 2;
        this.trail = [];
        this.energy = Math.random() * 0.5 + 0.5;
        this.attractionForce = Math.random() * 0.001 + 0.0005;
        this.mass = this.size * 0.1;
      }

      update(particles: ParticleType[]) {
        // Store trail positions
        this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.trail.length > particleConfig.trailLength) {
          this.trail.pop();
        }

        // Particle interactions and gravitational effects
        let fx = 0, fy = 0;
        particles.forEach(other => {
          if (other !== this) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 200) {
              // Attraction/repulsion based on energy
              const force = (this.energy * other.energy) / (distance * distance);
              const attraction = this.attractionForce * force;
              
              fx += (dx / distance) * attraction;
              fy += (dy / distance) * attraction;
              
              // Add some orbital motion
              if (distance < 100) {
                const orbitalForce = 0.001;
                fx += -dy * orbitalForce * this.energy;
                fy += dx * orbitalForce * this.energy;
              }
            }
          }
        });

        // Apply forces with momentum
        this.vx += fx;
        this.vy += fy;
        
        // Damping to prevent runaway speeds
        this.vx *= 0.99;
        this.vy *= 0.98;
        
        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > particleConfig.maxSpeed) {
          this.vx = (this.vx / speed) * particleConfig.maxSpeed;
          this.vy = (this.vy / speed) * particleConfig.maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulse += 0.04;

        // Add gentle floating motion with energy influence
        this.x += Math.sin(this.pulse) * 0.3 * this.energy;
        this.y += Math.cos(this.pulse * 0.7) * 0.2 * this.energy;

        // Dynamic energy fluctuation
        this.energy += Math.sin(this.pulse * 0.5) * 0.01;
        this.energy = Math.max(0.3, Math.min(1.2, this.energy));

        // Wrap around edges with smooth transition
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw trail first
        this.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (1 - index / this.trail.length) * 0.4;
          if (trailOpacity > 0.01) {
            ctx.save();
            ctx.globalAlpha = trailOpacity;
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${trailOpacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.size * (1 - index / this.trail.length) * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Enhanced pulsing opacity effect
        const pulseOpacity = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4) * this.energy;
        ctx.globalAlpha = pulseOpacity;
        
        // Multi-layer gradient glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3);
        gradient.addColorStop(0, `hsla(${this.hue}, 90%, 80%, ${pulseOpacity})`);
        gradient.addColorStop(0.3, `hsla(${this.hue}, 80%, 70%, ${pulseOpacity * 0.8})`);
        gradient.addColorStop(0.7, `hsla(${this.hue}, 70%, 60%, ${pulseOpacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core with energy glow
        ctx.globalAlpha = pulseOpacity * 0.9;
        ctx.fillStyle = `hsla(${this.hue}, 95%, 85%, ${pulseOpacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy ring
        if (this.energy > 0.8) {
          ctx.globalAlpha = (this.energy - 0.8) * 2 * pulseOpacity;
          ctx.strokeStyle = `hsla(${this.hue + 30}, 90%, 80%, ${pulseOpacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }

    // Floating particle class for additional beauty
    class FloatingParticle implements FloatingParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      life: number;
      maxLife: number;      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -Math.random() * 3 - 1;
        this.size = Math.random() * 2 + 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.hue = Math.random() * 80 + 280; // Purple to pink range
        this.life = 0;
        this.maxLife = 400 + Math.random() * 300;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        
        // Enhanced fade out over lifetime with curve
        const lifeRatio = this.life / this.maxLife;
        this.opacity = (1 - lifeRatio * lifeRatio) * 0.8;
        
        // More dynamic drift with spiral motion
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += Math.sin(this.life * 0.02) * 0.01;
        
        // Add spiral motion
        const spiralForce = 0.003;
        this.vx += Math.cos(this.life * 0.05) * spiralForce;
        this.vy += Math.sin(this.life * 0.05) * spiralForce * 0.5;
        
        // Size variation over lifetime
        this.size = (Math.random() * 2 + 0.8) * (1 - lifeRatio * 0.5);
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.life >= this.maxLife) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Multi-layer gradient with enhanced glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 4
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 95%, 85%, ${this.opacity})`);
        gradient.addColorStop(0.4, `hsla(${this.hue}, 85%, 75%, ${this.opacity * 0.7})`);
        gradient.addColorStop(0.8, `hsla(${this.hue}, 75%, 65%, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 65%, 55%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.globalAlpha = this.opacity * 0.9;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 90%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();}
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: particleConfig.count }, () => new Particle());
    floatingParticlesRef.current = Array.from({ length: particleConfig.floatingCount }, () => new FloatingParticle());

    // Enhanced animation loop with better FPS control
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {        // Create enhanced gradient background with depth
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.97)');
        gradient.addColorStop(0.4, 'rgba(30, 41, 59, 0.98)');
        gradient.addColorStop(0.8, 'rgba(51, 65, 85, 0.96)');
        gradient.addColorStop(1, 'rgba(30, 41, 59, 0.99)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle noise texture
        ctx.save();
        ctx.globalAlpha = 0.02;
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1, 1
          );
        }
        ctx.restore();// Update and draw main particles
        particlesRef.current.forEach(particle => {
          particle.update(particlesRef.current);
          particle.draw(ctx);
        });

        // Update and draw floating particles
        floatingParticlesRef.current.forEach((particle, index) => {
          particle.update();
          particle.draw(ctx);
          
          // Replace dead particles
          if (particle.life >= particle.maxLife) {
            floatingParticlesRef.current[index] = new FloatingParticle();
          }        });        // Enhanced connections with dynamic gradient lines and pulse effects
        ctx.save();
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p1 = particlesRef.current[i];
            const p2 = particlesRef.current[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < particleConfig.connectionDistance) {
              const alpha = (1 - distance / particleConfig.connectionDistance) * 0.6;
              const energyFactor = (p1.energy + p2.energy) / 2;
              const finalAlpha = alpha * energyFactor;
              
              // Dynamic line width based on energy and distance
              const lineWidth = (1 + energyFactor) * (1.5 - distance / particleConfig.connectionDistance);
              
              // Create enhanced gradient line with multiple color stops
              const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
              gradient.addColorStop(0, `hsla(${p1.hue}, 80%, 70%, ${finalAlpha})`);
              gradient.addColorStop(0.5, `hsla(${(p1.hue + p2.hue) / 2}, 85%, 75%, ${finalAlpha * 1.2})`);
              gradient.addColorStop(1, `hsla(${p2.hue}, 80%, 70%, ${finalAlpha})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = lineWidth;
              ctx.globalAlpha = finalAlpha;
              
              // Add pulsing effect based on particle phases
              const pulsePhase = (p1.pulse + p2.pulse) / 2;
              const pulseIntensity = 0.5 + Math.sin(pulsePhase) * 0.3;
              ctx.globalAlpha *= pulseIntensity;
              
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              
              // Add energy spark effects for close particles
              if (distance < particleConfig.connectionDistance * 0.4 && energyFactor > 0.8) {
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                
                ctx.save();
                ctx.globalAlpha = finalAlpha * 0.8;
                ctx.fillStyle = `hsla(${(p1.hue + p2.hue) / 2}, 90%, 85%, ${finalAlpha})`;
                ctx.beginPath();
                ctx.arc(midX, midY, 2 + Math.sin(pulsePhase) * 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
          }
        }
        ctx.restore();

        lastTime = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleConfig, debouncedResize]);  // Enhanced floating shapes for more visual appeal
  const floatingShapes = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 150 + 80,
      duration: Math.random() * 25 + 20,
      delay: i * 2.5,
      hue: 200 + Math.random() * 140, // Blue to purple range
      type: ['circle', 'diamond', 'hexagon'][Math.floor(Math.random() * 3)],
      opacity: 0.12 + Math.random() * 0.08,
    }))
  , []);

  const floatingOrbs = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 250 + 120,
      hue: 260 + Math.random() * 100, // Purple to pink range
      duration: Math.random() * 30 + 25,
      delay: i * 4,
      opacity: 0.08 + Math.random() * 0.12,
      blur: 30 + Math.random() * 20,
    }))
  , []);return (
    <>
      {/* Optimized canvas background with accessibility */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: reducedMotion ? 0.4 : 0.8, willChange: 'transform' }}
        aria-hidden="true"
        role="presentation"
      />

      {/* Optimized floating shapes with reduced motion support */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">        {!reducedMotion && floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              willChange: 'transform',
            }}
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -30, 30, 0],
              rotate: shape.type === 'hexagon' ? [0, 120, 240, 360] : [0, 180, 360],
              scale: [1, 1.15, 0.85, 1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          >
            <div
              className={`w-full h-full ${
                shape.type === 'circle' ? 'rounded-full' : 
                shape.type === 'hexagon' ? 'hexagon' : 'rotate-45'
              }`}
              style={{
                background: shape.type === 'hexagon' 
                  ? `linear-gradient(60deg, 
                      hsla(${shape.hue}, 85%, 75%, ${shape.opacity}),
                      hsla(${shape.hue + 40}, 80%, 70%, ${shape.opacity * 1.2}),
                      hsla(${shape.hue + 80}, 75%, 65%, ${shape.opacity}))`
                  : `conic-gradient(from 0deg, 
                      hsla(${shape.hue}, 85%, 75%, ${shape.opacity}),
                      hsla(${shape.hue + 60}, 80%, 70%, ${shape.opacity * 1.3}),
                      hsla(${shape.hue + 120}, 75%, 65%, ${shape.opacity}),
                      hsla(${shape.hue}, 85%, 75%, ${shape.opacity}))`,
                border: `1px solid hsla(${shape.hue}, 70%, 60%, ${shape.opacity * 2})`,
                filter: 'blur(1.5px)',
                boxShadow: `
                  0 0 ${shape.size / 3}px hsla(${shape.hue}, 80%, 70%, ${shape.opacity * 0.8}),
                  inset 0 0 ${shape.size / 4}px hsla(${shape.hue + 60}, 70%, 60%, ${shape.opacity * 0.5})
                `,
              }}
            />
          </motion.div>
        ))}        {/* Enhanced gradient orbs with beautiful effects */}
        {!reducedMotion && floatingOrbs.map((orb) => (
          <motion.div
            key={`orb-${orb.id}`}
            className="absolute rounded-full"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle at 25% 25%, 
                hsla(${orb.hue}, 95%, 85%, ${orb.opacity}),
                hsla(${orb.hue + 30}, 85%, 75%, ${orb.opacity * 0.8}) 30%,
                hsla(${orb.hue + 60}, 75%, 65%, ${orb.opacity * 0.5}) 60%,
                hsla(${orb.hue + 90}, 65%, 55%, ${orb.opacity * 0.2}) 80%,
                transparent 100%)`,
              filter: `blur(${orb.blur}px)`,
              willChange: 'transform',
            }}
            animate={{
              x: [0, 60, -60, 0],
              y: [0, -45, 45, 0],
              scale: [1, 1.25, 0.75, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }}
          />
        ))}
      </div>      {/* Enhanced dynamic grid overlay with multiple layers */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 197, 253, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 197, 253, 0.08) 1px, transparent 1px),
            linear-gradient(rgba(168, 85, 247, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.04) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 2px, transparent 2px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 40px 40px, 40px 40px, 120px 120px',
          willChange: 'opacity, transform',
        }}
        animate={reducedMotion ? {} : {
          opacity: [0.2, 0.7, 0.2],
          backgroundPosition: [
            '0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px', 
            '80px 80px, 80px 80px, 40px 40px, 40px 40px, 120px 120px'
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
    </>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;


