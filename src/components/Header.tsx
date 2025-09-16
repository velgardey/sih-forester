'use client';

import { Trees, Bell, Settings, User, Search } from 'lucide-react';
import { clsx } from 'clsx';

// Import JSON data
import navigationData from '@/data/navigation.json';
import userData from '@/data/user.json';

interface HeaderProps {
  activeView: 'overview' | 'monitoring' | 'alerts' | 'analytics';
  setActiveView: (view: 'overview' | 'monitoring' | 'alerts' | 'analytics') => void;
}

export function Header({ activeView, setActiveView }: HeaderProps) {
  const navItems = navigationData.navItems;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees':
        return Trees;
      case 'Search':
        return Search;
      case 'Bell':
        return Bell;
      case 'Settings':
        return Settings;
      default:
        return Trees;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className={`${userData.app.logo.bgColor} p-2 rounded-lg`}>
            <Trees className={`h-6 w-6 ${userData.app.logo.textColor}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{userData.app.name}</h1>
            <p className="text-sm text-gray-500">{userData.app.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as 'overview' | 'monitoring' | 'alerts' | 'analytics')}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeView === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
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
