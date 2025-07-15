import React, { useState } from 'react';

interface CommunityFeedbackPageProps {
  onFeedbackSubmitted: () => void;
}

export const CommunityFeedbackPage: React.FC<CommunityFeedbackPageProps> = ({ 
  onFeedbackSubmitted 
}) => {
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    title: '',
    description: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.title.trim() || !feedback.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      alert('Thank you for your feedback! Your input helps improve CryptoGuard AI.');
      onFeedbackSubmitted();
      setFeedback({
        type: 'suggestion',
        title: '',
        description: '',
        email: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Community Feedback</h1>
        <p className="text-text-secondary">
          Help us improve CryptoGuard AI by sharing your thoughts, suggestions, and bug reports.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Feedback Type *
            </label>
            <select
              value={feedback.type}
              onChange={(e) => setFeedback(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="suggestion">Feature Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="improvement">Improvement Idea</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Title *
            </label>
            <input
              type="text"
              value={feedback.title}
              onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description *
            </label>
            <textarea
              value={feedback.description}
              onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent h-32"
              placeholder="Detailed description of your feedback, suggestion, or bug report..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-text-muted mt-1">
              Optional: Provide your email if you'd like us to follow up on your feedback.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Feedback Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific and detailed in your descriptions</li>
          <li>• For bug reports, include steps to reproduce the issue</li>
          <li>• For feature suggestions, explain how it would benefit users</li>
          <li>• Keep feedback constructive and respectful</li>
        </ul>
      </div>
    </div>
  );
};