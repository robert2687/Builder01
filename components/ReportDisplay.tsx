import React from 'react';
import { AnalysisReport } from '../types';

interface ReportDisplayProps {
  report: AnalysisReport;
  onAddToWatchlist: (report: AnalysisReport) => void;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onAddToWatchlist }) => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-yellow-600 bg-yellow-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'High': return 'text-red-600 bg-red-100';
      case 'Critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {report.projectInput.name}
            {report.projectInput.symbol && (
              <span className="text-text-muted ml-2">({report.projectInput.symbol})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Overall Risk:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(report.overallRisk)}`}>
              {report.overallRisk}
            </span>
          </div>
        </div>
        <button
          onClick={() => onAddToWatchlist(report)}
          className="bg-brand-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal transition-colors"
        >
          Add to Watchlist
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold text-text-primary mb-3">Executive Summary</h3>
          <p className="text-text-secondary leading-relaxed">{report.executiveSummary}</p>
        </section>

        {report.redFlags.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-text-primary mb-3">🚩 Red Flags</h3>
            <div className="space-y-2">
              {report.redFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                    {flag.severity}
                  </span>
                  <p className="text-text-secondary flex-1">{flag.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {report.strengths.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-text-primary mb-3">✅ Strengths</h3>
            <div className="space-y-2">
              {report.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="px-2 py-1 rounded text-xs font-medium text-green-600 bg-green-100">
                    {strength.area}
                  </span>
                  <p className="text-text-secondary flex-1">{strength.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Team Assessment</h3>
            <p className="text-text-secondary leading-relaxed">{report.teamAssessment}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Technology Review</h3>
            <p className="text-text-secondary leading-relaxed">{report.technologyReview}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Tokenomics Insight</h3>
            <p className="text-text-secondary leading-relaxed">{report.tokenomicsInsight}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Community Sentiment</h3>
            <p className="text-text-secondary leading-relaxed">{report.communitySentiment}</p>
          </section>
        </div>

        {report.smartContractSecuritySummary && (
          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Smart Contract Security</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-text-secondary leading-relaxed mb-3">
                {report.smartContractSecuritySummary.summaryText}
              </p>
              <p className="text-xs text-text-muted italic">
                {report.smartContractSecuritySummary.disclaimer}
              </p>
            </div>
          </section>
        )}

        <div className="text-xs text-text-muted text-center pt-4 border-t border-gray-200">
          Analysis generated on {report.timestamp.toLocaleString()}
        </div>
      </div>
    </div>
  );
};