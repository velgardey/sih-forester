'use client';

import React from 'react';
import Image from 'next/image';
import GlobeIcon from '../../../public/globe.svg';
import UserIcon from '../../../public/user.svg';
import { useRouter } from 'next/navigation';

import navigationData from '@/data/navigation.json';

interface HeaderProps {
  activeView: 'overview' | 'monitoring' | 'alerts' | 'analytics';
  setActiveView: (view: 'overview' | 'monitoring' | 'alerts' | 'analytics') => void;
}

const Header = () => {
  const navItems = navigationData.navItems;
  const router = useRouter();

  const handleNav = (href: string) => {
    router.push(href);
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-green-800">
              Forester
            </a>
          </div>
          <nav className="hidden md:flex md:space-x-8 items-center">
            {navItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.href)}
                  className={
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-green-700 hover:scale-[1.01] hover:bg-green-200/55 font-medium transition-colors delay-50'
                  }
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex items-center space-x-4">
             <button className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              <Image
                src={GlobeIcon}
                alt="GlobeIcon"
                className="w-5 h-5 mr-2"
              />
              English
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Image
                src={UserIcon}
                alt="userIcon"
                className="w-6 h-6 text-gray-700"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;