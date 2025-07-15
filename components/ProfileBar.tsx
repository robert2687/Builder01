import React from 'react';
import { GamificationProfile } from '../types';
import { getTierByLevel, getNextTier } from '../gamificationConfig';

interface ProfileBarProps {
  profile: GamificationProfile;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({ profile }) => {
  const currentTier = getTierByLevel(profile.currentLevel);
  const nextTier = getNextTier(profile.currentLevel);

  const progressPercentage = nextTier 
    ? ((profile.insightPoints - (currentTier?.ipThreshold || 0)) / 
       (nextTier.ipThreshold - (currentTier?.ipThreshold || 0))) * 100
    : 100;

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
      <div className="flex items-center gap-1">
        <span className="text-lg">{currentTier?.icon || '🔰'}</span>
        <div className="text-xs">
          <div className="font-semibold text-text-primary">{profile.insightPoints} IP</div>
          <div className="text-text-muted">{currentTier?.name || 'Novice'}</div>
        </div>
      </div>
      
      {nextTier && (
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <span className="text-sm">🔥</span>
        <span className="text-xs font-medium text-text-secondary">
          {profile.streaks.currentDailyStreak}
        </span>
      </div>
    </div>
  );
};