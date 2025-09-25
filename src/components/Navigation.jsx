// src/components/Navigation.jsx
import React from 'react';
import { Home, MessageCircle, Calculator } from 'lucide-react';

const Navigation = ({ currentPath, onNavigateHome, onNavigateChat, hasResults }) => {
  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      onClick: onNavigateHome,
      enabled: true,
    },
    {
      path: '/chat',
      label: 'Chat Assistant',
      icon: MessageCircle,
      onClick: onNavigateChat,
      enabled: true,
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Calculator className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-blue-600">
                OR-NLP Optimizer
              </h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === currentPath;

              return (
                <button
                  key={item.path}
                  onClick={item.onClick}
                  disabled={!item.enabled}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : item.enabled
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {item.label}
                </button>
              );
            })}

            {/* Solution Status Indicator */}
            {hasResults && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Solution Ready
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
