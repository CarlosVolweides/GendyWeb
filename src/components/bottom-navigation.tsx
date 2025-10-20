import React from 'react';
import { List, Home, Calendar } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
}

function NavItem({ icon, active, onClick, darkMode }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all ${
        active
          ? 'bg-cyan-500 text-white'
          : darkMode
          ? 'text-gray-400 hover:text-gray-200'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {icon}
    </button>
  );
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode?: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, darkMode }: BottomNavigationProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t shadow-lg`}>
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="flex justify-around items-center">
          <NavItem
            icon={<List size={24} />}
            active={activeTab === 'list'}
            onClick={() => onTabChange('list')}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Home size={24} />}
            active={activeTab === 'home'}
            onClick={() => onTabChange('home')}
            darkMode={darkMode}
          />
          <NavItem
            icon={<Calendar size={24} />}
            active={activeTab === 'calendar'}
            onClick={() => onTabChange('calendar')}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}
