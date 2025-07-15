import React, { useState } from 'react';
import { AnalysisReport, GeminiService } from '../types';

interface CompareProjectsPageProps {
  geminiService: GeminiService | null;
  analyzedProjects: AnalysisReport[];
  onCompared: () => void;
  geminiServiceAvailable: boolean;
}

export const CompareProjectsPage: React.FC<CompareProjectsPageProps> = ({ 
  geminiService, 
  analyzedProjects, 
  onCompared, 
  geminiServiceAvailable 
}) => {
  const [selectedProject1, setSelectedProject1] = useState<string>('');
  const [selectedProject2, setSelectedProject2] = useState<string>('');
  const [comparison, setComparison] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!geminiService || !selectedProject1 || !selectedProject2) return;

    const project1 = analyzedProjects.find(p => p.id === selectedProject1);
    const project2 = analyzedProjects.find(p => p.id === selectedProject2);

    if (!project1 || !project2) return;

    setIsLoading(true);
    try {
      const result = await geminiService.generateComparativeAnalysis(project1, project2);
      if (result) {
        setComparison(result);
        onCompared();
      }
    } catch (error) {
      console.error('Error generating comparison:', error);
      setComparison('Error generating comparison. Please try again.');
    } finally {
      setIsLoading(false);
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

  if (analyzedProjects.length < 2) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚖️</span>
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Not Enough Projects</h2>
        <p className="text-text-secondary mb-6">
          You need at least 2 analyzed projects to use the comparison feature.
        </p>
        <p className="text-sm text-text-muted">
          Analyze more projects to start comparing them.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Compare Projects</h1>
        <p className="text-text-secondary">
          Select two projects to generate a detailed comparison analysis.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              First Project
            </label>
            <select
              value={selectedProject1}
              onChange={(e) => setSelectedProject1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">Select a project...</option>
              {analyzedProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectInput.name} ({project.overallRisk})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Second Project
            </label>
            <select
              value={selectedProject2}
              onChange={(e) => setSelectedProject2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">Select a project...</option>
              {analyzedProjects
                .filter(p => p.id !== selectedProject1)
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectInput.name} ({project.overallRisk})
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!selectedProject1 || !selectedProject2 || isLoading}
          className="w-full bg-brand-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating Comparison...' : 'Compare Projects'}
        </button>
      </div>

      {comparison && (
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Comparison Analysis</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-text-secondary leading-relaxed">
              {comparison}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};