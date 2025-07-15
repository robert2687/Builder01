import React from 'react';
import { GamificationProfile } from '../types';
import { getTierByLevel, getNextTier, getBadgeById, ANALYST_TIERS } from '../gamificationConfig';

interface ProfilePageProps {
  profile: GamificationProfile;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const currentTier = getTierByLevel(profile.currentLevel);
  const nextTier = getNextTier(profile.currentLevel);
  const earnedBadges = profile.earnedBadgeIds.map(id => getBadgeById(id)).filter(Boolean);

  const progressPercentage = nextTier 
    ? ((profile.insightPoints - (currentTier?.ipThreshold || 0)) / 
       (nextTier.ipThreshold - (currentTier?.ipThreshold || 0))) * 100
    : 100;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Your Profile</h1>
        <p className="text-text-secondary">
          Track your progress and achievements in cryptocurrency analysis.
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentTier?.icon || '🔰'}</div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {currentTier?.name || 'Novice Investigator'}
              </h2>
              <p className="text-text-secondary">Level {profile.currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-blue">{profile.insightPoints}</div>
            <div className="text-sm text-text-muted">Insight Points</div>
          </div>
        </div>

        {nextTier && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Progress to {nextTier.name}</span>
              <span>{profile.insightPoints} / {nextTier.ipThreshold} IP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-brand-blue h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {currentTier?.unlockedBenefits && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Current Benefits</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {currentTier.unlockedBenefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Streaks */}
      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">🔥 Activity Streaks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="font-semibold text-orange-800">Daily Streak</h3>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {profile.streaks.currentDailyStreak} days
            </div>
            <div className="text-sm text-orange-700">
              Best: {profile.streaks.longestDailyStreak} days
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📅</span>
              <h3 className="font-semibold text-purple-800">Weekly Activity</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {profile.streaks.currentWeeklyStreak} weeks
            </div>
            <div className="text-sm text-purple-700">
              Consistent engagement
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">🏆 Earned Badges</h2>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <div key={badge!.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{badge!.icon}</span>
                  <h3 className="font-semibold text-yellow-800">{badge!.name}</h3>
                </div>
                <p className="text-sm text-yellow-700">{badge!.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted">
            <div className="text-4xl mb-2">🏆</div>
            <p>No badges earned yet. Keep analyzing projects to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Tier Progression */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">📈 Analyst Tiers</h2>
        <div className="space-y-4">
          {ANALYST_TIERS.map((tier) => (
            <div 
              key={tier.level}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                tier.level === profile.currentLevel 
                  ? 'border-brand-blue bg-blue-50' 
                  : tier.level < profile.currentLevel
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-3xl">{tier.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {tier.name}
                  {tier.level === profile.currentLevel && (
                    <span className="ml-2 text-sm bg-brand-blue text-white px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                  {tier.level < profile.currentLevel && (
                    <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
                      Completed
                    </span>
                  )}
                </h3>
                <p className="text-sm text-text-secondary">
                  {tier.ipThreshold} IP required
                </p>
                {tier.unlockedBenefits && (
                  <ul className="text-xs text-text-muted mt-1">
                    {tier.unlockedBenefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};