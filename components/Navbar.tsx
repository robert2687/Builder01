import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems: { page: Page; label: string; icon: string }[] = [
    { page: 'analyze', label: 'Analyze', icon: '🔍' },
    { page: 'watchlist', label: 'Watchlist', icon: '👁️' },
    { page: 'compare', label: 'Compare', icon: '⚖️' },
    { page: 'learn', label: 'Learn', icon: '📚' },
    { page: 'feedback', label: 'Feedback', icon: '💬' },
    { page: 'profile', label: 'Profile', icon: '👤' },
    { page: 'monetization', label: 'Premium', icon: '💎' },
  ];

  return (
    <nav className="flex flex-wrap gap-1 sm:gap-2">
      {navItems.map(({ page, label, icon }) => (
        <button
          key={page}
          onClick={() => onNavigate(page)}
          className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
            currentPage === page
              ? 'bg-brand-blue text-white shadow-md'
              : 'text-text-secondary hover:text-brand-blue hover:bg-gray-100'
          }`}
        >
          <span className="text-xs">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
};