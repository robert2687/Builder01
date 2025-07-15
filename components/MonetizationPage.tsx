import React from 'react';

export const MonetizationPage: React.FC = () => {
  const features = [
    {
      title: 'Advanced AI Analysis',
      description: 'Get deeper insights with enhanced AI models and more comprehensive risk assessment.',
      icon: '🧠',
    },
    {
      title: 'Real-time Monitoring',
      description: 'Monitor your watchlist projects with real-time updates and alerts.',
      icon: '⚡',
    },
    {
      title: 'Portfolio Integration',
      description: 'Connect your crypto portfolio for personalized risk analysis.',
      icon: '📊',
    },
    {
      title: 'Priority Support',
      description: 'Get priority customer support and direct access to our team.',
      icon: '🎧',
    },
    {
      title: 'Advanced Comparisons',
      description: 'Compare unlimited projects with detailed side-by-side analysis.',
      icon: '⚖️',
    },
    {
      title: 'Export Reports',
      description: 'Export detailed analysis reports in PDF format for sharing.',
      icon: '📄',
    },
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">CryptoGuard AI Premium</h1>
        <p className="text-text-secondary">
          Unlock advanced features and take your crypto analysis to the next level.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal rounded-xl p-8 text-white text-center mb-8">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold mb-2">Premium Features Coming Soon!</h2>
        <p className="text-blue-100 mb-4">
          We're working hard to bring you advanced features that will revolutionize your crypto analysis experience.
        </p>
        <div className="bg-white/20 rounded-lg p-4 inline-block">
          <p className="text-sm">Be the first to know when Premium launches!</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
            <p className="text-text-secondary">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Preview */}
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Free</h3>
            <div className="text-3xl font-bold text-text-primary mb-4">$0</div>
            <ul className="text-sm text-text-secondary space-y-2 mb-6">
              <li>✅ Basic project analysis</li>
              <li>✅ Watchlist (up to 10 projects)</li>
              <li>✅ Educational content</li>
              <li>✅ Community features</li>
            </ul>
            <button className="w-full bg-gray-200 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>
          
          <div className="border-2 border-brand-blue rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-medium">
              Coming Soon
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Premium</h3>
            <div className="text-3xl font-bold text-brand-blue mb-4">$19<span className="text-lg">/mo</span></div>
            <ul className="text-sm text-text-secondary space-y-2 mb-6">
              <li>✅ Everything in Free</li>
              <li>✅ Advanced AI analysis</li>
              <li>✅ Real-time monitoring</li>
              <li>✅ Unlimited watchlist</li>
              <li>✅ Portfolio integration</li>
              <li>✅ Priority support</li>
            </ul>
            <button className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg font-medium opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50 rounded-xl p-6 mt-8 text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Stay Updated</h3>
        <p className="text-text-secondary mb-4">
          Join our newsletter to be notified when Premium features become available.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-blue-light transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};