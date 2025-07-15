import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
      <h4 className="font-semibold mb-2">⚠️ Important Disclaimer</h4>
      <p className="mb-2">
        CryptoGuard AI provides analysis for educational and informational purposes only. 
        This is not financial advice, investment advice, or a recommendation to buy, sell, or hold any cryptocurrency.
      </p>
      <p className="mb-2">
        Always conduct your own research (DYOR) and consult with qualified financial advisors before making investment decisions. 
        Cryptocurrency investments carry significant risks and can result in substantial losses.
      </p>
      <p>
        The AI analysis may contain errors or omissions. Use this tool as one of many resources in your research process.
      </p>
    </div>
  );
};