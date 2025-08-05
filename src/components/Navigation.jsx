import React from 'react';
import { Home, Settings, BarChart3, Eye, ChevronRight } from 'lucide-react';

const Navigation = ({
  currentPath,
  onNavigateHome,
  onNavigateConstraints,
  onNavigateResults,
  onNavigateVisualization,
  hasResults
}) => {
  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      onClick: onNavigateHome,
      enabled: true
    },
    {
      path: '/constraints',
      label: 'Constraints',
      icon: Settings,
      onClick: onNavigateConstraints,
      enabled: true
    },
    {
      path: '/results',
      label: 'Results',
      icon: BarChart3,
      onClick: onNavigateResults,
      enabled: hasResults
    },
    {
      path: '/visualization',
      label: 'Visualization',
      icon: Eye,
      onClick: onNavigateVisualization,
      enabled: hasResults
    }
  ];

  const getCurrentStepIndex = () => {
    return navItems.findIndex(item => item.path === currentPath);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">LP Optimizer</h1>
            </div>
          </div>

          {/* Navigation Steps */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.path === currentPath;
                const isCompleted = index < currentStepIndex;
                const isEnabled = item.enabled;

                return (
                  <div key={item.path} className="flex items-center">
                    <button
                      onClick={item.onClick}
                      disabled={!isEnabled}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : isEnabled
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Icon size={16} className="mr-2" />
                      {item.label}
                      {isCompleted && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </button>
                    
                    {index < navItems.length - 1 && (
                      <ChevronRight 
                        size={16} 
                        className={`mx-2 ${
                          index < currentStepIndex ? 'text-green-500' : 'text-gray-400'
                        }`} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Step {currentStepIndex + 1} of {navItems.length}
              </span>
              <div className="flex space-x-1">
                {navItems.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStepIndex
                        ? 'bg-blue-600'
                        : index < currentStepIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStepIndex + 1) / navItems.length) * 100}%`
          }}
        />
      </div>
    </nav>
  );
};

export default Navigation;
