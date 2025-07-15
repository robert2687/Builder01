import { Badge, AnalystTier, InsightPointReason, GamificationProfile } from './types';

export const POINT_VALUES: Record<InsightPointReason, number> = {
  APP_INIT: 0, // Usually no points for just initializing
  COMPLETE_ONBOARDING: 50,
  READ_DISCLAIMER_PAGE: 25,
  PROJECT_ANALYSIS_SUBMIT: 100,
  PROJECT_ANALYSIS_DETAILED_INPUT: 25, // Bonus if multiple fields are filled
  ADD_TO_WATCHLIST: 20,
  USE_COMPARE_FEATURE: 30,
  COMPLETE_EDUCATIONAL_ARTICLE: 40,
  COMPLETE_EDUCATIONAL_QUIZ_SUCCESS: 60,
  COMPLETE_EDUCATIONAL_QUIZ_PERFECT: 20, // Bonus for 100%
  SPOT_RED_FLAG_CHALLENGE_SUCCESS: 30,
  CHATBOT_INTERACTION: 5, // Per interaction, maybe capped
  SUBMIT_COMMUNITY_FEEDBACK: 15,
  COMMUNITY_FEEDBACK_VALIDATED: 100, // Higher value for validated feedback
  DAILY_LOGIN: 5,
  WEEKLY_STREAK_BONUS: 50,
  BADGE_AWARD_BONUS: 10, // Small bonus for earning any badge
};

export const ANALYST_TIERS: AnalystTier[] = [
  { level: 1, name: "Novice Investigator", ipThreshold: 0, icon: "🔰", unlockedBenefits: ["Access basic analysis features."] },
  { level: 2, name: "Apprentice Analyst", ipThreshold: 250, icon: "🧑‍🎓", unlockedBenefits: ["Unlock 'Spot the Red Flag' challenges."] },
  { level: 3, name: "Junior Researcher", ipThreshold: 750, icon: "🔬", unlockedBenefits: ["Access to more detailed educational articles (simulated)."] },
  { level: 4, name: "Seasoned Sleuth", ipThreshold: 1500, icon: "🕵️", unlockedBenefits: ["Unlock advanced comparison view (simulated)."] },
  { level: 5, name: "Expert Guardian", ipThreshold: 3000, icon: "🛡️✨", unlockedBenefits: ["Priority access to new educational content (simulated)."] },
];

export const BADGES: Badge[] = [
  // Onboarding & Basics
  { id: "B001", name: "Welcome Aboard!", description: "Completed the initial app setup.", icon: "🎉", criteriaMessage: "Finish the onboarding guide." },
  { id: "B002", name: "First Analysis", description: "Successfully analyzed your first crypto project.", icon: "💡", criteriaMessage: "Analyze one project." },
  { id: "B003", name: "Watchful Eye", description: "Added your first project to the watchlist.", icon: "👁️", criteriaMessage: "Add 1 project to watchlist." },

  // Learning Milestones
  { id: "L001", name: "Security Pupil", description: "Completed your first security-focused educational article.", icon: "🛡️", criteriaMessage: "Read 1 security article." },
  { id: "L002", name: "Tokenomics Explorer", description: "Explored the basics of tokenomics.", icon: "🪙", criteriaMessage: "Read 1 tokenomics article." },
  { id: "L003", name: "Quiz Novice", description: "Passed your first educational quiz.", icon: "🎓", criteriaMessage: "Pass 1 quiz." },
  { id: "L004", name: "Red Flag Spotter Rookie", description: "Correctly identified your first red flag in a challenge.", icon: "🚩", criteriaMessage: "Win 1 'Spot the Red Flag' challenge." },
  
  // Analysis Proficiency
  { id: "A001", name: "Diligent Researcher (Bronze)", description: "Analyzed 5 crypto projects.", icon: "🥉", criteriaMessage: "Analyze 5 projects." },
  { id: "A002", name: "Diligent Researcher (Silver)", description: "Analyzed 10 crypto projects.", icon: "🥈", criteriaMessage: "Analyze 10 projects." },
  { id: "A003", name: "Comparer", description: "Used the project comparison tool.", icon: "⚖️", criteriaMessage: "Compare 2 projects." },

  // Consistency
  { id: "C001", name: "Streak Starter", description: "Maintained a 3-day usage streak.", icon: "🔥", criteriaMessage: "Log in and act for 3 days straight." },
  { id: "C002", name: "Weekly Dedication", description: "Engaged meaningfully for a full week.", icon: "🗓️", criteriaMessage: "Active for 7 days in a row." },
  
  // Community (Basic for now)
  { id: "F001", name: "Feedback Contributor", description: "Submitted your first piece of community feedback.", icon: "💬", criteriaMessage: "Submit 1 feedback." }
];

export const getBadgeById = (id: string): Badge | undefined => BADGES.find(b => b.id === id);
export const getTierByLevel = (level: number): AnalystTier | undefined => ANALYST_TIERS.find(t => t.level === level);
export const getNextTier = (currentLevel: number): AnalystTier | undefined => ANALYST_TIERS.find(t => t.level === currentLevel + 1);

export const INITIAL_GAMIFICATION_PROFILE: (userId: string) => GamificationProfile = (userId) => ({
  userId,
  insightPoints: 0,
  currentLevel: 1,
  earnedBadgeIds: [],
  streaks: {
    currentDailyStreak: 0,
    longestDailyStreak: 0,
    lastLoginDate: null,
    currentWeeklyStreak: 0,
    lastWeeklyBonusDate: null,
  },
  createdAt: new Date(),
  lastUpdatedAt: new Date(),
});