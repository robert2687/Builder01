import React from 'react';
import { WatchlistItem } from '../types';

interface WatchlistPageProps {
  watchlist: WatchlistItem[];
  onRemove: (itemId: string) => void;
  onViewReport: (report: any) => void;
  geminiServiceAvailable: boolean;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({ 
  watchlist, 
  onRemove, 
  onViewReport, 
  geminiServiceAvailable 
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      case 'Critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!geminiServiceAvailable) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Service Unavailable</h2>
          <p className="text-red-600">
            The Gemini service is not available. Please check your API configuration.
          </p>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">👁️</span>
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Your Watchlist is Empty</h2>
        <p className="text-text-secondary mb-6">
          Add projects to your watchlist to keep track of their analysis and updates.
        </p>
        <p className="text-sm text-text-muted">
          Analyze a project and click "Add to Watchlist" to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Your Watchlist</h1>
        <p className="text-text-secondary">
          Keep track of analyzed projects and monitor their risk levels.
        </p>
      </div>

      <div className="grid gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {item.name}
                  {item.symbol && (
                    <span className="text-text-muted ml-2">({item.symbol})</span>
                  )}
                </h3>
                <p className="text-sm text-text-muted">
                  Added on {item.addedDate.toLocaleDateString()}
                </p>
              </div>
              {item.overallRisk && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(item.overallRisk)}`}>
                  {item.overallRisk}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {item.report && (
                <button
                  onClick={() => onViewReport(item.report)}
                  className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blue-light transition-colors"
                >
                  View Report
                </button>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};