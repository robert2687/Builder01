import React, { useState } from 'react';

interface EducationalPageProps {
  onItemCompleted: (itemId: string, itemType: 'article' | 'quiz_success' | 'quiz_perfect' | 'challenge_success') => void;
  currentAnalystTier: number;
}

export const EducationalPage: React.FC<EducationalPageProps> = ({ 
  onItemCompleted, 
  currentAnalystTier 
}) => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const articles = [
    {
      id: 'security-basics',
      title: 'Cryptocurrency Security Fundamentals',
      content: `
        Understanding cryptocurrency security is crucial for any investor or enthusiast. Here are the key concepts:

        **Private Keys and Wallets**
        Your private key is essentially your ownership proof of cryptocurrency. Never share it with anyone. Use hardware wallets for large amounts.

        **Common Security Threats**
        - Phishing attacks targeting wallet credentials
        - Fake websites and applications
        - Social engineering attacks
        - Smart contract vulnerabilities

        **Best Practices**
        - Use two-factor authentication
        - Verify website URLs carefully
        - Keep software updated
        - Use reputable exchanges and wallets
        - Never invest more than you can afford to lose

        **Red Flags to Watch For**
        - Promises of guaranteed returns
        - Pressure to invest quickly
        - Lack of technical documentation
        - Anonymous or unverifiable team members
      `,
      tier: 1,
    },
    {
      id: 'tokenomics-guide',
      title: 'Understanding Tokenomics',
      content: `
        Tokenomics refers to the economic model behind a cryptocurrency token. Key factors include:

        **Supply Mechanics**
        - Total supply: Maximum number of tokens that will ever exist
        - Circulating supply: Tokens currently available in the market
        - Inflation/deflation mechanisms

        **Distribution**
        - How tokens are allocated (team, investors, public)
        - Vesting schedules for team and investor tokens
        - Fair launch vs. pre-mine

        **Utility and Demand**
        - What the token is used for in the ecosystem
        - Staking rewards and governance rights
        - Burn mechanisms that reduce supply

        **Warning Signs**
        - Excessive team allocation (>20%)
        - No clear utility or use case
        - Unlimited token supply without burn mechanisms
        - Lack of transparency in distribution
      `,
      tier: 2,
    },
  ];

  const quizzes = [
    {
      id: 'security-quiz',
      title: 'Security Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What should you never share with anyone?',
          options: ['Public address', 'Private key', 'Transaction hash', 'Wallet name'],
          correct: 'Private key',
        },
        {
          id: 'q2',
          question: 'Which is the most secure way to store large amounts of cryptocurrency?',
          options: ['Exchange wallet', 'Mobile app', 'Hardware wallet', 'Paper wallet'],
          correct: 'Hardware wallet',
        },
      ],
      tier: 1,
    },
  ];

  const challenges = [
    {
      id: 'red-flag-challenge-1',
      title: 'Spot the Red Flag: Project Analysis',
      scenario: `
        You're evaluating "MoonCoin" with the following characteristics:
        - Anonymous team with no LinkedIn profiles
        - Promises 1000% returns in 30 days
        - No whitepaper or technical documentation
        - Heavy marketing focus on "getting rich quick"
        - Smart contract not audited
        
        What's the biggest red flag?
      `,
      options: [
        'No technical documentation',
        'Promises of 1000% returns',
        'Anonymous team',
        'Unaudited smart contract',
      ],
      correct: 'Promises of 1000% returns',
      explanation: 'While all these are concerning, promises of guaranteed high returns are the biggest red flag as they indicate a likely scam.',
      tier: 2,
    },
  ];

  const handleArticleComplete = (articleId: string) => {
    onItemCompleted(articleId, 'article');
    alert('Article completed! You earned Insight Points.');
  };

  const handleQuizSubmit = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });

    const percentage = (correct / quiz.questions.length) * 100;
    
    if (percentage >= 70) {
      if (percentage === 100) {
        onItemCompleted(quizId, 'quiz_perfect');
        alert(`Perfect score! You earned bonus Insight Points.`);
      } else {
        onItemCompleted(quizId, 'quiz_success');
        alert(`Quiz passed with ${percentage}%! You earned Insight Points.`);
      }
    } else {
      alert(`Score: ${percentage}%. You need 70% to pass. Try again!`);
    }
  };

  const handleChallengeSubmit = (challengeId: string, answer: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    if (answer === challenge.correct) {
      onItemCompleted(challengeId, 'challenge_success');
      alert(`Correct! ${challenge.explanation}\n\nYou earned Insight Points!`);
    } else {
      alert(`Incorrect. ${challenge.explanation}\n\nTry again!`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Learn & Earn</h1>
        <p className="text-text-secondary">
          Expand your knowledge and earn Insight Points through articles, quizzes, and challenges.
        </p>
      </div>

      {/* Articles Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">📚 Educational Articles</h2>
        <div className="grid gap-4">
          {articles
            .filter(article => article.tier <= currentAnalystTier)
            .map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-text-primary">{article.title}</h3>
                  <span className="text-xs bg-brand-blue text-white px-2 py-1 rounded">
                    Tier {article.tier}
                  </span>
                </div>
                
                {selectedArticle === article.id ? (
                  <div>
                    <div className="prose max-w-none mb-4">
                      <div className="whitespace-pre-line text-text-secondary">
                        {article.content}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArticleComplete(article.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Mark as Complete
                      </button>
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedArticle(article.id)}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blue-light transition-colors"
                  >
                    Read Article
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">🎓 Knowledge Quizzes</h2>
        <div className="grid gap-4">
          {quizzes
            .filter(quiz => quiz.tier <= currentAnalystTier)
            .map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-text-primary">{quiz.title}</h3>
                  <span className="text-xs bg-brand-accent text-white px-2 py-1 rounded">
                    Tier {quiz.tier}
                  </span>
                </div>
                
                {selectedQuiz === quiz.id ? (
                  <div className="space-y-4">
                    {quiz.questions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-medium text-text-primary mb-3">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                onChange={(e) => setQuizAnswers(prev => ({
                                  ...prev,
                                  [question.id]: e.target.value
                                }))}
                                className="mr-2"
                              />
                              <span className="text-text-secondary">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuizSubmit(quiz.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Submit Quiz
                      </button>
                      <button
                        onClick={() => setSelectedQuiz(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuiz(quiz.id)}
                    className="bg-brand-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal transition-colors"
                  >
                    Take Quiz
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Challenges Section */}
      <section>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">🚩 Red Flag Challenges</h2>
        <div className="grid gap-4">
          {challenges
            .filter(challenge => challenge.tier <= currentAnalystTier)
            .map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-text-primary">{challenge.title}</h3>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                    Tier {challenge.tier}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-text-secondary whitespace-pre-line">{challenge.scenario}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {challenge.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleChallengeSubmit(challenge.id, option)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};