import React, { useState } from 'react';
import { ProjectInput } from '../types';

interface ProjectInputFormProps {
  onSubmit: (input: ProjectInput) => void;
  isLoading: boolean;
}

export const ProjectInputForm: React.FC<ProjectInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProjectInput>({
    name: '',
    symbol: '',
    websiteUrl: '',
    whitepaperContent: '',
    smartContractInfo: '',
    otherInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Project name is required');
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ProjectInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Project Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Enter project name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={formData.symbol || ''}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., BTC, ETH"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={formData.websiteUrl || ''}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Whitepaper Content
          </label>
          <textarea
            value={formData.whitepaperContent || ''}
            onChange={(e) => handleInputChange('whitepaperContent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent h-32"
            placeholder="Paste whitepaper content or key excerpts here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Smart Contract Info
          </label>
          <textarea
            value={formData.smartContractInfo || ''}
            onChange={(e) => handleInputChange('smartContractInfo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent h-24"
            placeholder="Contract address, audit reports, or code snippets..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Additional Information
          </label>
          <textarea
            value={formData.otherInfo || ''}
            onChange={(e) => handleInputChange('otherInfo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent h-24"
            placeholder="Any other relevant information..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="w-full bg-brand-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Project'}
        </button>
      </form>
    </div>
  );
};