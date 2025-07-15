import { Chat } from "@google/genai";

export interface ProjectInput {
  id?: string; // Optional ID for tracking, e.g., for watchlist
  name: string;
  symbol?: string;
  websiteUrl?: string;
  whitepaperContent?: string;
  smartContractInfo?: string; // Can be address, audit link, or code snippet
  otherInfo?: string;
}

export interface RedFlag {
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Strength {
  description:string;
  area: 'Team' | 'Technology' | 'Community' | 'Tokenomics' | 'Innovation' | 'Other';
}

export interface ElindExplanation {
  originalConcept: string;
  explanation: string;
}

export interface SmartContractSecuritySummary {
  summaryText: string;
  disclaimer: string; // AI must populate this with a standard disclaimer
  identifiedIssues?: Array<{issue: string, severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical'}>; // Optional: if AI can list specific items
}

export interface AnalysisReport {
  id: string; // Use project name or a generated ID for uniqueness
  projectInput: ProjectInput; // Store the input that generated this report
  overallRisk: 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical' | 'Undetermined';
  executiveSummary: string;
  redFlags: RedFlag[];
  strengths: Strength[];
  teamAssessment: string;
  technologyReview: string;
  elindExplanation?: ElindExplanation;
  tokenomicsInsight: string; // Will keep this for general insights
  detailedTokenomics?: string; // For the new advanced analysis
  communitySentiment: string;
  smartContractSecuritySummary?: SmartContractSecuritySummary; // New simplified security output
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface GeminiService {
  analyzeProject: (projectInput: ProjectInput) => Promise<AnalysisReport | null>;
  startChat: (systemPrompt: string) => Promise<Chat | null>;
  sendMessageToChat: (chat: Chat, message: string) => Promise<string | null>;
  generateComparativeAnalysis: (report1: AnalysisReport, report2: AnalysisReport) => Promise<string | null>;
}

export interface WatchlistItem {
  id: string; // Corresponds to AnalysisReport.id or ProjectInput.name
  name: string;
  symbol?: string;
  overallRisk?: AnalysisReport['overallRisk'];
  addedDate: Date;
  report?: AnalysisReport; // Optionally store the full report
}

export type Page = 'analyze' | 'watchlist' | 'compare' | 'learn' | 'feedback' | 'profile' | 'monetization';

export interface StoredProject { // For storing analyzed projects temporarily
  input: ProjectInput;
  report: AnalysisReport;
}

// Gamification Types
export type InsightPointReason =
  | 'APP_INIT'
  | 'COMPLETE_ONBOARDING'
  | 'READ_DISCLAIMER_PAGE'
  | 'PROJECT_ANALYSIS_SUBMIT'
  | 'PROJECT_ANALYSIS_DETAILED_INPUT'
  | 'ADD_TO_WATCHLIST'
  | 'USE_COMPARE_FEATURE'
  | 'COMPLETE_EDUCATIONAL_ARTICLE'
  | 'COMPLETE_EDUCATIONAL_QUIZ_SUCCESS'
  | 'COMPLETE_EDUCATIONAL_QUIZ_PERFECT'
  | 'SPOT_RED_FLAG_CHALLENGE_SUCCESS'
  | 'CHATBOT_INTERACTION'
  | 'SUBMIT_COMMUNITY_FEEDBACK'
  | 'COMMUNITY_FEEDBACK_VALIDATED'
  | 'DAILY_LOGIN'
  | 'WEEKLY_STREAK_BONUS'
  | 'BADGE_AWARD_BONUS';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Could be an emoji or an SVG path string for simplicity client-side
  criteriaMessage: string; // e.g., "Complete your first project analysis"
}

export interface AnalystTier {
  level: number;
  name: string;
  ipThreshold: number;
  icon?: string; // Icon for the tier
  unlockedBenefits?: string[]; // Text descriptions of benefits
}

export interface StreakData {
  currentDailyStreak: number;
  longestDailyStreak: number;
  lastLoginDate: string | null; // ISO date string
  currentWeeklyStreak: number; // Number of consecutive weeks with 3+ active days
  lastWeeklyBonusDate: string | null; // ISO date string for last weekly bonus
}

export interface GamificationProfile {
  userId: string; // Could be a simple generated ID
  insightPoints: number;
  currentLevel: number; // Corresponds to AnalystTier.level
  earnedBadgeIds: string[];
  streaks: StreakData;
  createdAt: Date;
  lastUpdatedAt: Date;
}