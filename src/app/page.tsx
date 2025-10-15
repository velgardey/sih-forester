'use client';

import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-[#F7F6F1] min-h-screen font-sans">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
