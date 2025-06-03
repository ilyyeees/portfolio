import React, { Suspense } from 'react';
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SkipNavigation from "@/components/SkipNavigation";
import { AdvancedSEO } from "@/components/AdvancedSEO";

// Simple loading fallback with accessibility
const SimpleLoader = () => (
  <div 
    className="min-h-screen bg-background flex items-center justify-center"
    role="status"
    aria-label="Loading portfolio content"
  >
    <div className="text-2xl text-foreground" aria-live="polite">
      Loading...
    </div>
  </div>
);

const Index: React.FC = () => {
  return (
    <Suspense fallback={<SimpleLoader />}>
      <AdvancedSEO />
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <SkipNavigation />
        <AnimatedBackground />
        <ScrollProgressBar />
        <div className="relative z-10">
          <Header />
          <main 
            id="main-content"
            role="main"
            aria-label="Main portfolio content"
            className="focus-within:outline-none"
          >
            <section id="home">
              <Hero />
            </section>
            <section id="about">
              <About />
            </section>
            <section id="skills">
              <Skills />
            </section>
            <section id="projects">
              <Projects />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default Index;
