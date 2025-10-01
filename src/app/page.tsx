'use client';

import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import React from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type View = 'overview' | 'monitoring' | 'alerts' | 'analytics';

const LandingPage = () => {
  const pathname = usePathname();
  
  const [selectedForest, setSelectedForest] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<View>('overview');

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/monitoring')) setActiveView('monitoring');
    else if (pathname.startsWith('/alerts')) setActiveView('alerts');
    else if (pathname.startsWith('/analytics')) setActiveView('analytics');
    else setActiveView('overview');
  }, [pathname]);

  return (
    <div className="bg-[#F7F6F1] min-h-screen font-sans">
      <Header activeView={activeView} setActiveView={setActiveView}/>
      <main>
        <HeroSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
