'use client';

import { Trees, Bell, User, Home, Map, Upload, BarChart, FileText } from 'lucide-react';
import { clsx } from 'clsx';

// Import JSON data
import navigationData from '@/data/navigation.json';
import userData from '@/data/user.json';
import { useRouter, usePathname } from 'next/navigation';

type NavView = 'home' | 'fra-map' | 'upload' | 'statistics' | 'schemes';

interface HeaderProps {
  activeView?: NavView;
  setActiveView?: (view: NavView) => void;
}

export function Header({ activeView, setActiveView }: HeaderProps) {
  const navItems = navigationData.navItems;
  const router = useRouter();
  const pathname = usePathname();

  // Determine active view from pathname if not provided
  const currentView = activeView || (() => {
    if (pathname === '/') return 'home';
    if (pathname?.startsWith('/fra-map')) return 'fra-map';
    if (pathname?.startsWith('/upload')) return 'upload';
    if (pathname?.startsWith('/statistics')) return 'statistics';
    if (pathname?.startsWith('/schemes')) return 'schemes';
    return 'home';
  })();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return Home;
      case 'Map':
        return Map;
      case 'Upload':
        return Upload;
      case 'BarChart':
        return BarChart;
      case 'FileText':
        return FileText;
      case 'Trees':
        return Trees;
      default:
        return Home;
    }
  };

  const handleNav = (id: string, href: string) => {
    if (setActiveView) {
      setActiveView(id as NavView);
    }
    router.push(href);
  };  

  return (
    <header className="bg-white border-b border-gray-200 px-6 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div
          onClick={() => handleNav('home', '/')}
          className="flex items-center space-x-3 cursor-pointer hover:bg-green-50 p-2 rounded-lg transition-colors"
        >
          <div className={`${userData.app.logo.bgColor} p-2 rounded-lg`}>
            <Trees className={`h-6 w-6 ${userData.app.logo.textColor}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">{userData.app.name}</h1>
            <p className="text-sm text-black">{userData.app.description}</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          {navItems.map((item) => {
            const Icon = getIcon(item.icon);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id, item.href)}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors delay-50',
                  currentView === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className={`${userData.user.avatar.bgColor} p-2 rounded-full`}>
              <User className={`h-4 w-4 ${userData.user.avatar.textColor}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{userData.user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
