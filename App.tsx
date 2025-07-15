
import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectInputForm } from './components/ProjectInputForm';
import { ReportDisplay } from './components/ReportDisplay';
import { Chatbot } from './components/Chatbot';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Disclaimer } from './components/Disclaimer';
import { WatchlistPage } from './components/WatchlistPage';
import { CompareProjectsPage } from './components/CompareProjectsPage';
import { EducationalPage } from './components/EducationalPage';
import { CommunityFeedbackPage } from './components/CommunityFeedbackPage';
import { ProfileBar } from './components/ProfileBar';
import { ProfilePage } from './components/ProfilePage';
import { MonetizationPage } from './components/MonetizationPage';

import { 
  ProjectInput, AnalysisReport, ChatMessage, GeminiService, Page, WatchlistItem, StoredProject,
  GamificationProfile, InsightPointReason, Badge as BadgeType 
} from './types';
import { initGeminiService } from './services/geminiService';
import { Chat } from '@google/genai';
import { POINT_VALUES, ANALYST_TIERS, BADGES, INITIAL_GAMIFICATION_PROFILE, getBadgeById, getTierByLevel, getNextTier } from './gamificationConfig';

const App: React.FC = () => {
  const [currentProjectInput, setCurrentProjectInput] = useState<ProjectInput | null>(null);
  const [currentAnalysisReport, setCurrentAnalysisReport] = useState<AnalysisReport | null>(null);
  const [analyzedProjects, setAnalyzedProjects] = useState<StoredProject[]>(() => {
    const saved = localStorage.getItem('cryptoGuardAnalyzedProjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('analyze');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('cryptoGuardWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile>(() => {
    const savedProfile = localStorage.getItem('cryptoGuardGamificationProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.createdAt = new Date(profile.createdAt);
      profile.lastUpdatedAt = new Date(profile.lastUpdatedAt);
      if(profile.streaks.lastLoginDate) profile.streaks.lastLoginDate = new Date(profile.streaks.lastLoginDate).toISOString().split('T')[0];
      if(profile.streaks.lastWeeklyBonusDate) profile.streaks.lastWeeklyBonusDate = new Date(profile.streaks.lastWeeklyBonusDate).toISOString().split('T')[0];
      return profile;
    }
    return INITIAL_GAMIFICATION_PROFILE('defaultUser');
  });

  useEffect(() => {
    localStorage.setItem('cryptoGuardGamificationProfile', JSON.stringify(gamificationProfile));
  }, [gamificationProfile]);

  useEffect(() => {
    localStorage.setItem('cryptoGuardAnalyzedProjects', JSON.stringify(analyzedProjects));
  }, [analyzedProjects]);
  
  useEffect(() => {
    localStorage.setItem('cryptoGuardWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const checkAndApplyLevelUp = useCallback((profileToCheck: GamificationProfile) => {
    const currentTier = getTierByLevel(profileToCheck.currentLevel);
    const nextTier = getNextTier(profileToCheck.currentLevel);

    if (nextTier && currentTier && profileToCheck.insightPoints >= nextTier.ipThreshold) {
      setGamificationProfile(prev => ({
        ...prev,
        insightPoints: profileToCheck.insightPoints,
        currentLevel: nextTier.level,
        lastUpdatedAt: new Date(),
      }));
      alert(`Level Up! You are now a ${nextTier.name}! ${nextTier.icon || ''}`);
    }
  }, []);

  const awardPoints = useCallback((reason: InsightPointReason, amountOverride?: number) => {
    const points = amountOverride ?? POINT_VALUES[reason] ?? 0;
    if (points === 0 && reason !== 'APP_INIT') return;

    console.log(`Awarding ${points} IP for ${reason}`);
    setGamificationProfile(prev => {
      const updatedProfileWithPoints = {
        ...prev,
        insightPoints: prev.insightPoints + points,
        lastUpdatedAt: new Date(),
      };
      checkAndApplyLevelUp(updatedProfileWithPoints); 
      return updatedProfileWithPoints; 
    });
  }, [checkAndApplyLevelUp]);

  const awardBadge = useCallback((badgeId: string) => {
    const badge = getBadgeById(badgeId);
    if (!badge) return;

    setGamificationProfile(prev => {
      if (prev.earnedBadgeIds.includes(badgeId)) return prev;
      
      alert(`Badge Earned: ${badge.name}! 🎉 \n${badge.description}`);
      
      const newProfileWithBadge = {
        ...prev,
        earnedBadgeIds: [...prev.earnedBadgeIds, badgeId],
        lastUpdatedAt: new Date(),
      };
      const pointsForBadge = POINT_VALUES.BADGE_AWARD_BONUS || 0;
      newProfileWithBadge.insightPoints += pointsForBadge;
      if (pointsForBadge > 0) console.log(`Awarding ${pointsForBadge} IP for BADGE_AWARD_BONUS`);
      
      checkAndApplyLevelUp(newProfileWithBadge);

      return newProfileWithBadge;
    });
  }, [checkAndApplyLevelUp]);


  const updateStreak = useCallback((type: 'dailyLogin' | 'weeklyActivity') => {
    setGamificationProfile(prev => {
      const today = new Date().toISOString().split('T')[0];
      let newStreaks = { ...prev.streaks };
      let pointsToAwardReasons: InsightPointReason[] = [];
      let badgesToAwardIds: string[] = [];

      if (type === 'dailyLogin') {
        if (prev.streaks.lastLoginDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (prev.streaks.lastLoginDate === yesterdayStr) {
            newStreaks.currentDailyStreak += 1;
          } else {
            newStreaks.currentDailyStreak = 1;
          }
          newStreaks.lastLoginDate = today;
          newStreaks.longestDailyStreak = Math.max(newStreaks.longestDailyStreak, newStreaks.currentDailyStreak);
          
          pointsToAwardReasons.push('DAILY_LOGIN');
          
          if (newStreaks.currentDailyStreak > 0 && newStreaks.currentDailyStreak % 7 === 0) {
             pointsToAwardReasons.push('WEEKLY_STREAK_BONUS');
             if (!prev.earnedBadgeIds.includes('C002')) badgesToAwardIds.push('C002');
          } else if (newStreaks.currentDailyStreak >= 3 && !prev.earnedBadgeIds.includes('C001')) {
             if (!prev.earnedBadgeIds.includes('C001')) badgesToAwardIds.push('C001');
          }
        }
      }

      let updatedProfile = { ...prev, streaks: newStreaks, lastUpdatedAt: new Date() };
      let totalPointsAwardedThisUpdate = 0;
      pointsToAwardReasons.forEach(reason => {
        const points = POINT_VALUES[reason] || 0;
        updatedProfile.insightPoints += points;
        totalPointsAwardedThisUpdate += points;
        if (points > 0) console.log(`Awarding ${points} IP (from streak update) for ${reason}`);
      });

      badgesToAwardIds.forEach(badgeId => {
        if (!updatedProfile.earnedBadgeIds.includes(badgeId)) {
          updatedProfile.earnedBadgeIds = [...updatedProfile.earnedBadgeIds, badgeId];
          const badge = getBadgeById(badgeId);
          if (badge) alert(`Badge Earned: ${badge.name}! 🎉 \n${badge.description}`);
          const badgeBonusPoints = POINT_VALUES.BADGE_AWARD_BONUS || 0;
          updatedProfile.insightPoints += badgeBonusPoints;
          totalPointsAwardedThisUpdate += badgeBonusPoints;
           if (badgeBonusPoints > 0) console.log(`Awarding ${badgeBonusPoints} IP (from streak update) for BADGE_AWARD_BONUS`);
        }
      });
      
      if (totalPointsAwardedThisUpdate > 0 || badgesToAwardIds.length > 0) {
        checkAndApplyLevelUp(updatedProfile);
      }
      return updatedProfile;
    });
  }, [checkAndApplyLevelUp]);

  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      setGeminiService(initGeminiService(apiKey));
    } else {
      setError("API_KEY is not configured. Please set the API_KEY environment variable.");
      console.error("API_KEY is not configured.");
    }
    updateStreak('dailyLogin');

    if (gamificationProfile.insightPoints === INITIAL_GAMIFICATION_PROFILE('').insightPoints && gamificationProfile.earnedBadgeIds.length === 0) {
        awardPoints('APP_INIT'); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStreak]); // Removed awardPoints and gamificationProfile from dependency array to avoid loops if APP_INIT points are awarded multiple times

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleProjectSubmit = useCallback(async (input: ProjectInput) => {
    if (!geminiService) {
      setError("Gemini service is not initialized. Check API Key.");
      setCurrentPage('analyze');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentAnalysisReport(null);
    setCurrentChat(null);
    setCurrentProjectInput(input);
    setCurrentPage('analyze');

    try {
      const report = await geminiService.analyzeProject(input);
      if (report) {
        setCurrentAnalysisReport(report);
        setAnalyzedProjects(prev => {
          const existingIndex = prev.findIndex(p => p.input.name === input.name);
          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = { input, report };
            return updated;
          }
          return [...prev, { input, report }];
        });

        awardPoints('PROJECT_ANALYSIS_SUBMIT');
        if (input.whitepaperContent && input.smartContractInfo && input.websiteUrl) {
          awardPoints('PROJECT_ANALYSIS_DETAILED_INPUT');
        }
        if (analyzedProjects.length + 1 === 1) awardBadge('B002');
        if (analyzedProjects.length + 1 === 5) awardBadge('A001');
        if (analyzedProjects.length + 1 === 10) awardBadge('A002');

        const systemPrompt = `You are CryptoGuard AI's assistant. The user just received an analysis for the project "${input.name}". The executive summary is: "${report.executiveSummary}". Please answer follow-up questions thoughtfully and concisely, referring to the project analysis context. Do not give financial advice.`;
        const chatInstance = await geminiService.startChat(systemPrompt);
        setCurrentChat(chatInstance);
      } else {
        setError('Failed to generate analysis report. The response might be empty or invalid.');
      }
    } catch (e: any) {
      console.error("Error generating report:", e);
      setError(e.message || 'An unknown error occurred while generating the report.');
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, awardPoints, awardBadge, analyzedProjects.length]);

  const addToWatchlist = (report: AnalysisReport) => {
    if (!watchlist.find(item => item.id === report.id)) {
      const newItem: WatchlistItem = {
        id: report.id,
        name: report.projectInput.name,
        symbol: report.projectInput.symbol,
        overallRisk: report.overallRisk,
        addedDate: new Date(),
        report: report
      };
      setWatchlist(prev => [...prev, newItem]);
      awardPoints('ADD_TO_WATCHLIST');
      if (watchlist.length === 0) awardBadge('B003');
      alert(`${report.projectInput.name} added to watchlist! (+${POINT_VALUES.ADD_TO_WATCHLIST} IP)`);
    } else {
      alert(`${report.projectInput.name} is already in the watchlist.`);
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };
  
  const viewArchivedReport = (report: AnalysisReport) => {
    setCurrentProjectInput(report.projectInput);
    setCurrentAnalysisReport(report);
    setCurrentChat(null); 
    setCurrentPage('analyze');
  };

  const handleEducationalItemCompleted = (itemId: string, itemType: 'article' | 'quiz_success' | 'quiz_perfect' | 'challenge_success') => {
    let reason: InsightPointReason | null = null;
    if (itemType === 'article') reason = 'COMPLETE_EDUCATIONAL_ARTICLE';
    else if (itemType === 'quiz_success') reason = 'COMPLETE_EDUCATIONAL_QUIZ_SUCCESS';
    else if (itemType === 'quiz_perfect') reason = 'COMPLETE_EDUCATIONAL_QUIZ_PERFECT';
    else if (itemType === 'challenge_success') reason = 'SPOT_RED_FLAG_CHALLENGE_SUCCESS';
    
    if (reason) awardPoints(reason);

    if (itemType === 'article') awardBadge('L001'); 
    if (itemType.includes('quiz')) awardBadge('L003'); 
    if (itemType === 'challenge_success') awardBadge('L004'); 
  };
  
  const handleFeedbackSubmitted = () => {
    awardPoints('SUBMIT_COMMUNITY_FEEDBACK');
    awardBadge('F001');
  };

  const handleCompared = () => {
    awardPoints('USE_COMPARE_FEATURE');
    awardBadge('A003');
  };

  const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={`w-9 h-9 text-brand-blue ${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-200 text-text-primary flex flex-col items-center selection:bg-brand-blue/30 selection:text-white">
      <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <AppLogo />
                    <h1 className="ml-3 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-accent to-brand-teal">
                        CryptoGuard AI
                    </h1>
                </div>
                 <div className="flex items-center space-x-2 sm:space-x-4">
                    {gamificationProfile && <ProfileBar profile={gamificationProfile} />}
                    <Navbar currentPage={currentPage} onNavigate={handleNavigation} />
                </div>
            </div>
        </div>
      </header>
      
      <main className="w-full max-w-screen-lg p-4 sm:p-6 lg:p-8 mt-4 flex-grow">
        {error && (currentPage === 'analyze' || !geminiService) && ( 
           <div className="mb-6 bg-danger-bg border border-red-300 text-danger-text px-4 py-3 rounded-lg relative shadow-md" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {currentPage === 'analyze' && (
          <>
            {!currentAnalysisReport && !isLoading && !error && geminiService && (
                <div className="mb-8 text-center text-text-secondary bg-gray-100 p-6 rounded-xl shadow-xl">
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">Welcome to CryptoGuard AI</h2>
                    <p>Enter project details below to start your AI-powered due diligence. (+{POINT_VALUES.PROJECT_ANALYSIS_SUBMIT} IP for each analysis!)</p>
                </div>
            )}

            {geminiService && <ProjectInputForm onSubmit={handleProjectSubmit} isLoading={isLoading} />}
            
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}
                       
            {currentAnalysisReport && !isLoading && (
              <ReportDisplay report={currentAnalysisReport} onAddToWatchlist={addToWatchlist} />
            )}
            
            {currentChat && currentProjectInput && currentAnalysisReport && !isLoading && geminiService && (
              <Chatbot
                chatInstance={currentChat}
                geminiService={geminiService}
                projectContext={{ name: currentProjectInput.name, summary: currentAnalysisReport.executiveSummary }}
                onInteraction={() => awardPoints('CHATBOT_INTERACTION', 5)}
              />
            )}
          </>
        )}

        {currentPage === 'watchlist' && (
          <WatchlistPage 
            watchlist={watchlist} 
            onRemove={removeFromWatchlist} 
            onViewReport={viewArchivedReport}
            geminiServiceAvailable={!!geminiService}
          />
        )}


        {currentPage === 'compare' && (
          <CompareProjectsPage 
            geminiService={geminiService} 
            analyzedProjects={analyzedProjects.map(p => p.report)} 
            onCompared={handleCompared}
            geminiServiceAvailable={!!geminiService}
          />
        )}

        {currentPage === 'learn' && (
          <EducationalPage 
            onItemCompleted={handleEducationalItemCompleted} 
            currentAnalystTier={gamificationProfile.currentLevel}
          />
        )}
        {currentPage === 'feedback' && <CommunityFeedbackPage onFeedbackSubmitted={handleFeedbackSubmitted} />}
        
        {currentPage === 'profile' && gamificationProfile && (
          <ProfilePage profile={gamificationProfile} />
        )}

        {currentPage === 'monetization' && <MonetizationPage />}

      </main>

      <div className="w-full max-w-screen-lg p-4 sm:p-6 lg:p-8 mt-auto">
         <Disclaimer />
      </div>

      <footer className="w-full text-center py-6 border-t border-gray-300 text-text-muted text-xs sm:text-sm px-4">
        <p>&copy; {new Date().getFullYear()} CryptoGuard AI. For informational and educational purposes only. Not financial advice.</p>
        <p>Gamification elements are for engagement and learning. Always Do Your Own Research (DYOR).</p>
      </footer>
    </div>
  );
};

export default App;