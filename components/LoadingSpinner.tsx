import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-brand-blue rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-text-secondary font-medium">Analyzing project...</p>
      <p className="text-sm text-text-muted">This may take a few moments</p>
    </div>
  );
};